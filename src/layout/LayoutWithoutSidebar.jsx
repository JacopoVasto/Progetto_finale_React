import { Outlet } from "react-router";
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function LayoutWithoutSidebar() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
        <main className="flex-1 p-6 bg-base-100 bg-diagonal-lines">
          <Outlet />
        </main>
      <Footer />
    </div>
  );
}