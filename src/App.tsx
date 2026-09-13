import { HashRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { CartProvider } from './context/CartContext'
import { Home } from './pages/Home'
import { Browse } from './pages/Browse'
import { EventDetail } from './pages/EventDetail'
import { Cart } from './pages/Cart'
import { MyTickets } from './pages/MyTickets'
import { Checkout } from './pages/Checkout'
import { Confirmation } from './pages/Confirmation'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <ScrollToTop />
        <div className="shell">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/tickets" element={<MyTickets />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </HashRouter>
  )
}
