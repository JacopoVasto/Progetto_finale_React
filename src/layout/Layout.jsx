import { Outlet } from "react-router";
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-base-100">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}