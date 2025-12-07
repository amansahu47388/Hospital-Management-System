import React from "react";
import { stats as s, chartSeries as c, doctors as d, stock as st, appointments as ap } from "../data/dummyData";

export function useFetchData() {
  // Simulate an API fetch delay
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    stats: [],
    chart: [],
    doctors: [],
    stock: [],
    appointments: [],
  });

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setData({ stats: s, chart: c, doctors: d, stock: st, appointments: ap });
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return { loading, data };
}
