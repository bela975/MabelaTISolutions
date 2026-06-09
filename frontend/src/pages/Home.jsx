import Header from "../components/Header";
import Footer from "../components/Footer";

import gallery1 from "../assets/gallery-1.svg";
import gallery2 from "../assets/gallery-2.svg";
import gallery3 from "../assets/gallery-3.svg";
import gallery4 from "../assets/gallery-4.svg";

export default function Home() {
  return (
    <div className="page-shell">
      <Header
        title="Mabela Serviços de TI"
        subtitle="Transformando tecnologia em resultados."
      />

      <main className="main-inner">

        <section className="card">
          <h2>Quem Somos</h2>

          <p>
            A Mabela Serviços de TI é especializada em soluções tecnológicas,
            suporte remoto, auditoria de segurança, implantação em nuvem e
            evolução de sistemas corporativos.
          </p>
        </section>

        <section className="card">
          <h2>Nossos Serviços</h2>

          <ul>
            <li>Implantação em Nuvem</li>
            <li>Suporte Remoto Premium</li>
            <li>Auditoria de Segurança</li>
            <li>Backup Gerenciado</li>
            <li>Pequenas Evoluções em Software</li>
          </ul>
        </section>

        <section className="card">
          <h2>Galeria</h2>

          <div className="gallery-grid">
            <img src={gallery1} alt="" />
            <img src={gallery2} alt="" />
            <img src={gallery3} alt="" />
            <img src={gallery4} alt="" />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}