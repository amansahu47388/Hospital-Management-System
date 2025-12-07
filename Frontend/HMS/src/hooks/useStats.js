import React from "react";

export function useStats(data) {
  const totalPatients = React.useMemo(() => {
    return data?.chart?.reduce((acc, row) => acc + (row.patients || 0), 0) || 0;
  }, [data]);

  return { totalPatients };
}
