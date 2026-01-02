import { useEffect } from "react";

export default function PrintAppointment({ data, onDone }) {
  useEffect(() => {
    if (!data) return;

    const win = window.open("", "", "width=900,height=600");
    win.document.write(`
      <html>
      <head>
        <title>Appointment Print</title>
        <style>
          body { font-family: Arial; padding:20px }
          .header { display:flex; gap:15px; border-bottom:2px solid #000 }
          img { width:80px }
          .grid { display:grid; grid-template-columns:1fr 1fr; gap:10px }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/hospital-logo.png" />
          <div>
            <h2>City Hospital</h2>
            <p>Appointment Details</p>
          </div>
        </div>

        <div class="grid">
          ${Object.entries(data).map(
            ([k,v]) => `<p><b>${k.replace("_"," ")}:</b> ${v}</p>`
          ).join("")}
        </div>
      </body>
      </html>
    `);

    win.document.close();
    win.print();
    win.close();
    onDone();
  }, [data]);

  return null;
}
