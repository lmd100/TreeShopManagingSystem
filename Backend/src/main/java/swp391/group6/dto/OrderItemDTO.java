package swp391.group6.dto;

import swp391.group6.model.OrderDetail;

import java.math.BigDecimal;

public class OrderItemDTO {
    private long productId;
    private String productName;
    private String sku;
    private int quantity;
    private BigDecimal pricePaid;

    public OrderItemDTO() {
    }

    public OrderItemDTO(OrderDetail detail) {
        if (detail.getProduct() != null) {
            this.productId = detail.getProduct().getId();
            this.productName = detail.getProduct().getName();
            this.sku = detail.getProduct().getSku();
        }
        this.quantity = detail.getQuantity();
        this.pricePaid = detail.getPricePaid();
    }

    public long getProductId() { return productId; }
    public void setProductId(long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getPricePaid() { return pricePaid; }
    public void setPricePaid(BigDecimal pricePaid) { this.pricePaid = pricePaid; }
}
