import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { safeFetch } from "../../src/api/fetchClient"; // ✅ added

const CompanyContact = () => {
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    workingHours: "",
  });

  // ✅ fetch using safeFetch
  const fetchData = async () => {
    try {
      const data = await safeFetch("/api/company-contact");
      if (data) setForm(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load contact details");
    }
  };

  // ✅ submit using safeFetch
  const handleSubmit = async () => {
    try {
      await safeFetch("/api/company-contact", {
        method: "POST",
        body: form,
      });
      toast.success("Contact details updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update contact details");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Company Contact Details</h1>

      <Textarea
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <Input
        placeholder="Phone"
        className="mt-4"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <Input
        placeholder="Email"
        className="mt-4"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        placeholder="Working Hours"
        className="mt-4"
        value={form.workingHours}
        onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
      />

      <Button className="mt-6" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
};

export default CompanyContact;
