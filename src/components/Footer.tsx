const COLUMNS = [
  { title: 'Discover', items: ['Concerts', 'Sports', 'Arts & Theater', 'Comedy', 'Gift cards'] },
  { title: 'Your account', items: ['Sign in', 'My tickets', 'Order lookup', 'Transfer tickets'] },
  { title: 'Help', items: ['Help center', 'Refund policy', 'Delivery options', 'Contact us'] },
  { title: 'Company', items: ['About Tixly', 'Careers', 'Partners', 'Press'] },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cols">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer__base">
          Tixly is a fictional demo storefront built for A2Z Homework 1. Events, artists, venues and
          prices are invented, and no tickets are sold or payments taken.
        </div>
      </div>
    </footer>
  )
}
