import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Calendar from "@/components/calendar/calendar";

export default function Home() {
  return (
    <div className="font-LINESeed">
      <Header />
      <main>
        <Calendar />
      </main>
      <Footer />
    </div>
  );
}
