function exportPdf(div) {
    console.log("Função para exportar PDF com mapa da sala");
    console.log(div);

    // obtendo o elemento para ser exportado
    const divToExport = document.getElementById(div);

    // cria um novo objeto pdf para ser manipulado
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    // edita o pdf para ter o formato certo
    // pdf.fromHTML(divToExport, 10, 0, {'height': 700});

    // exporta o pdf gerado
    // pdf.save(div);

    pdf.html(div, { callback: function(pdf) {
        pdf.save();
        },
        x: 10
    });
}