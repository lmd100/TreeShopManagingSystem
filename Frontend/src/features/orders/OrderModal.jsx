import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { timeFormat } from "../../utils/timeFormat";
import { useAuth } from "../../context/AuthState";
import ShipperSelect from "./ShipperSelect";
import ORDER_STATUS_MAP from "./data/orderStatusMap";

const TRANSITIONS = {
    MANAGER: {
        PROCESSING: ['PENDING'],
        PENDING: ['DELIVERING'],
        RETURN_PENDING: ['RETURNING'],
    },
    SHIPPER: {
        DELIVERING: ['ARRIVED', 'FAILED'],
        RETURNING: ['FAILED'],
    },
    CUSTOMER: {
        ARRIVED: ['RECEIVED', 'RETURN_PENDING'],
    },
};

/**
 * @param {{ selectedOrder: object|null, onClose: () => void, onOrderUpdated: (order: object) => void }} props
 */
export default function OrderModal({ selectedOrder, onClose, onOrderUpdated }) {
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    if (!selectedOrder) return null;

    const role = user?.roleName ?? user?.role;
    const details = selectedOrder.orderDetailList || [];
    const itemsTotal = details.reduce((sum, item) => sum + (Number(item.pricePaid || 0) * (item.quantity || 0)), 0);
    const shippingFee = Number(selectedOrder.shippingFee || 0);
    const discount = Number(selectedOrder.discount || 0);
    const finalTotal = Math.max(0, itemsTotal + shippingFee - discount);

    const statusConfig = ORDER_STATUS_MAP[selectedOrder.status]
        || { bg: 'bg-gray-100 text-gray-700', label: selectedOrder.status };
    const allowedStatuses = TRANSITIONS[role]?.[selectedOrder.status] || [];

    const updateShipper = async (shipperId) => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            const response = await fetch(`/api/orders/${selectedOrder.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shipperId: shipperId ? Number(shipperId) : null,
                }),
            });
            if (!response.ok) {
                throw new Error('Unable to update the assigned shipper.');
            }
            onOrderUpdated(await response.json());
        } catch (error) {
            setUpdateError(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const updateStatus = async (status) => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            const response = await fetch(
                `/api/orders/${selectedOrder.id}/status?status=${encodeURIComponent(status)}`,
                { method: 'PUT', credentials: 'include' },
            );
            if (!response.ok) {
                throw new Error('That status transition is not allowed.');
            }
            const detailResponse = await fetch(`/api/orders/${selectedOrder.id}`, {
                credentials: 'include',
            });
            if (!detailResponse.ok) {
                throw new Error('The order changed, but its details could not be refreshed.');
            }
            onOrderUpdated(await detailResponse.json());
        } catch (error) {
            setUpdateError(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
      <Modal
        isOpen={!!selectedOrder}
        onClose={onClose}
        title={`Order Details - #ORD-${selectedOrder.id}`}
      >
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Status Banner */}
          <div className="rounded-lg bg-interactive/10 p-3 flex items-center justify-between border border-interactive/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-black/55">Status</span>
              <p className={`text-sm font-bold mt-0.5 ${statusConfig.bg} px-2 py-0.5 rounded-full inline-block`}>
                {statusConfig.label}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-black/55">Ordered On</span>
              <p className="text-xs font-semibold text-black/75 mt-0.5">{timeFormat(selectedOrder.createdAt)}</p>
            </div>
          </div>

          {/* Shipper Assignment */}
          {(role === 'MANAGER' || role === 'SYSTEM_ADMIN') && (
            <div className="p-3 rounded-lg bg-bg-base border border-border/55">
              <ShipperSelect
                value={selectedOrder.shipperId ?? ''}
                onChange={updateShipper}
                disabled={isUpdating}
              />
            </div>
          )}

          {/* Items Section */}
          <div>
            <h4 className="text-xs font-bold text-black/60 uppercase tracking-wider mb-2">Items Breakdown</h4>
            <div className="space-y-2">
              {details.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-base border border-border/55">
                  <div className="flex flex-col max-w-[200px]">
                    <span className="text-sm font-semibold text-black/90 truncate">
                      {item.productName || item.product?.name || 'Unknown Product'}
                    </span>
                    <span className="text-[10px] text-black/45 mt-0.5">
                      SKU: {item.sku || item.product?.sku || 'N/A'}
                    </span>
                  </div>
                  <div className="text-right flex flex-col">
                    <span className="text-sm font-bold text-black/85">
                      ${(Number(item.pricePaid || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-black/50 mt-0.5">
                      ${Number(item.pricePaid || 0).toFixed(2)} x {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
              {details.length === 0 && (
                <p className="text-sm text-black/40 italic">No products listed in this order.</p>
              )}
            </div>
          </div>

          {allowedStatuses.length > 0 && (
            <div className="p-3 rounded-lg bg-bg-base border border-border/55">
              <h4 className="text-xs font-bold text-black/60 uppercase tracking-wider mb-2">
                Available Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                {allowedStatuses.map((status) => (
                  <Button
                    key={status}
                    variant="secondary"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => updateStatus(status)}
                  >
                    Mark as {ORDER_STATUS_MAP[status]?.label ?? status}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {updateError && (
            <p className="text-sm text-red-600">{updateError}</p>
          )}

          {/* Shipping Address */}
          <div className="p-3 rounded-lg bg-bg-base border border-border/55">
            <h4 className="text-xs font-bold text-black/60 uppercase tracking-wider mb-1.5">Shipping Address</h4>
            <p className="text-xs text-black/80 leading-relaxed">
              {selectedOrder.shippingAddress || 'No shipping address specified.'}
            </p>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-1.5 border-t border-border/60 pt-3 text-sm text-black/75">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-green-600">+${shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount Applied</span>
              <span className="font-semibold text-red-500">-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-2 text-base font-extrabold text-black">
              <span>Grand Total</span>
              <span className="text-interactive">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Close / Actions */}
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" className="px-4 py-2" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              className="px-4 py-2"
              onClick={() => {
                alert(`Receipt for Order #ORD-${selectedOrder.id} sent to printer!`);
              }}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      </Modal>
    );
}
