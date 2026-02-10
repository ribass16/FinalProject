import { useEffect, useState } from 'react';
import { subscribeAgendamentos } from '../services/appointmentService';
import jsPDF from 'jspdf';
import logoUrl from '../assets/logo.png';

const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
};

const svgToPngDataUrl = (svgText, width = 300, height = 80) => {
  return new Promise((resolve, reject) => {
    const svg = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (e) => reject(e);
    img.src = svg;
  });
};

const Relatorios = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const unsubscribe = subscribeAgendamentos((items) => {
      setAgendamentos(items);
    });
    return () => unsubscribe();
  }, []);

  const filtered = agendamentos
    .filter((a) => a.data === date)
    .sort((a, b) => timeToMinutes(a.hora) - timeToMinutes(b.hora));

  const exportPDF = async () => {
    let logoPng = null;
    try {
      const resp = await fetch(logoUrl);
      const svgText = await resp.text();
      logoPng = await svgToPngDataUrl(svgText, 160, 48);
    } catch (e) {
      console.warn('Não foi possível carregar o logo para o PDF:', e);
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerTop = 40;

    // logotipo 
    let logoHeight = 0;
    if (logoPng) {
      const imgW = 120;
      const imgH = 36;
      doc.addImage(logoPng, 'PNG', 40, headerTop, imgW, imgH);
      logoHeight = imgH;
    }

    const headerY = headerTop + logoHeight + 18;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Relatório de Agendamentos — ${date}`, pageWidth / 2, headerY, { align: 'center' });

    let y = headerY + 24;

    if (filtered.length === 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Sem agendamentos para esta data.', 40, y);
    } else {
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const cols = [40, 90, 170, 320, 460];
      doc.text('#', cols[0], y);
      doc.text('Hora', cols[1], y);
      doc.text('Carro', cols[2], y);
      doc.text('Cliente', cols[3], y);
      doc.text('Contacto', cols[4], y);
      y += 14;
      doc.setDrawColor(200);
      doc.line(40, y - 6, pageWidth - 40, y - 6);

      doc.setFont('helvetica', 'normal');
      filtered.forEach((a, i) => {
        if (y > doc.internal.pageSize.getHeight() - 60) {
          doc.addPage();
          y = 40;
        }

        const cliente = a.nome || a.email || '—';
        const contacto = a.telefone || a.email || '—';
        const carro = a.carroNome || '—';

        doc.text(String(i + 1), cols[0], y);
        doc.text(a.hora || '—', cols[1], y);
        doc.text(carro, cols[2], y);
        doc.text(cliente, cols[3], y);
        doc.text(contacto, cols[4], y);

        y += 16;
      });
    }

    doc.save(`relatorio-${date}.pdf`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
          <button onClick={exportPDF} className="bg-gray-900 text-white px-4 py-2 rounded-lg">Exportar PDF</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-600">Sem agendamentos para {date}.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">#</th>
                <th className="py-2">Hora</th>
                <th className="py-2">Carro</th>
                <th className="py-2">Cliente</th>
                <th className="py-2">Contacto</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2 align-top">{i + 1}</td>
                  <td className="py-2 align-top">{a.hora}</td>
                  <td className="py-2 align-top">{a.carroNome}</td>
                  <td className="py-2 align-top">{a.nome || a.email}</td>
                  <td className="py-2 align-top">{a.telefone || a.email}</td>
                  <td className="py-2 align-top">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Relatorios;
