import { Link } from 'react-router-dom'
import Container from './Container'

const quickLinks = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Catalog', to: '/catalog' },
  { label: 'Quản lý', to: '/manage' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <Container className="grid gap-8 py-10 text-sm text-[var(--text)] lg:grid-cols-[1.3fr_0.8fr_0.9fr]">
        <div className="space-y-3">
          <div className="text-base font-semibold text-[var(--text-h)]">Tree Shop Managing System</div>
          <p className="max-w-xl leading-6">
            Cửa hàng cây xanh trực tuyến với catalog công khai, thông tin sản phẩm rõ ràng và khu
            quản lý riêng cho đội ngũ vận hành.
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Lối đi nhanh
          </div>
          <div className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-[var(--text-h)]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Ghi chú
          </div>
          <p>Catalog là nơi xem sản phẩm công khai.</p>
          <p>Manage là nơi cập nhật categories và products.</p>
        </div>
      </Container>
    </footer>
  )
}
