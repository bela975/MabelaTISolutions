import visa from "../assets/visa.svg";
import mastercard from "../assets/mastercard.svg";
import paypal from "../assets/paypal.svg";
import pix from "../assets/pix.svg";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <table className="footer-layout">
          <tbody>
            <tr>
              <td>
                <div className="footer-block">
                  <h3>Contatos</h3>
                  <ul>
                    <li>Telefone fixo: (11) 3210-4455</li>
                    <li>WhatsApp: (11) 98888-7766</li>
                    <li>contato@nexati.com.br</li>
                  </ul>
                </div>
              </td>

              <td>
                <div className="footer-block">
                  <h3>Endereço</h3>
                  <p>Av. Paulista, 1000, Bela Vista, São Paulo - SP.</p>
                </div>
              </td>

              <td>
                <div className="footer-block">
                  <h3>Formas de pagamento</h3>
                  <div className="payment-icons">
                    <img src={visa} alt="Visa" />
                    <img src={mastercard} alt="Mastercard" />
                    <img src={paypal} alt="PayPal" />
                    <img src={pix} alt="Pix" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </footer>
  );
}