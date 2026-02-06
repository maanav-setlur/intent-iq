import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProactiveMessageWidget } from "@/components/ProactiveMessageWidget";
import { VisitorIdentificationForm } from "@/components/VisitorIdentificationForm";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

export function Layout() {
  const {
    proactiveMessage,
    dismissMessage,
    showForm,
    identifyVisitor,
    dismissForm,
  } = useVisitorTracking();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <VisitorIdentificationForm
        open={showForm}
        onSubmit={identifyVisitor}
        onDismiss={dismissForm}
      />
      <ProactiveMessageWidget message={proactiveMessage} onDismiss={dismissMessage} />
    </div>
  );
}
