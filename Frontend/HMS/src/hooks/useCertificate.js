import { useState } from "react";

const DUMMY_PATIENTS = [
  {
    id: 1,
    number: "OPD-1023",
    name: "Rahul Sharma",
    gender: "Male",
    mobile: "9876543210",
    status: "Discharged",
  },
  {
    id: 2,
    number: "IPD-2045",
    name: "Anita Verma",
    gender: "Female",
    mobile: "9123456789",
    status: "Admitted",
  },
  {
    id: 3,
    number: "OPD-1098",
    name: "Suresh Patel",
    gender: "Male",
    mobile: "9988776655",
    status: "Discharged",
  },
];

export default function useCertificate() {
  const [filters, setFilters] = useState({
    module: "",
    status: "",
    template: "",
  });

  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const searchPatients = () => {
    // simulate API filtering
    setPatients(
      DUMMY_PATIENTS.filter(
        (p) =>
          (!filters.status || p.status === filters.status)
      )
    );
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(
      selected.length === patients.length
        ? []
        : patients.map((p) => p.id)
    );
  };

  return {
    filters,
    patients,
    selected,
    handleChange,
    searchPatients,
    toggleSelect,
    toggleSelectAll,
  };
}
