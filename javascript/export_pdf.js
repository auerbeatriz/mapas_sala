/* exporta apenas o horario de uma aula especifica */
function exportPdf(div) {

    // obtendo o elemento para ser exportado
    const divToExport = document.getElementById(div);

    const title = divToExport.firstChild.textContent;
    const tableToExport = divToExport.lastChild;

    // estilizando a tabela para o texto ficar maior no PDF
    const lastFontSize = tableToExport.style.fontSize;
    tableToExport.style.fontSize = '13px';

    // cria um novo objeto pdf para ser manipulado no formato A4 paisagem
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    // imprime os elementos a serem impressos no PDF (nome da sala - tabela)
    pdf.text(title, 14, 15);
    pdf.autoTable({ html: tableToExport, useCss: true, startY: 22 });

    // salva o pdf
    pdf.save("Mapa sala - " + title + ".pdf");

    // retorna o tamanho do texto da tabela para o tamanho original da pagina
    tableToExport.style.fontSize = lastFontSize;

}

/* exporta todas as tabelas, uma em cada pagina do pdf */
function exportAll2pdf() {

    // cria um novo objeto pdf para ser manipulado no formato A4 paisagem
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    for (let i=0; i < table_ids.length; i++) {

        // obtendo o elemento para ser exportado
        const divToExport = document.getElementById(table_ids[i]);

        const title = divToExport.firstChild.textContent;
        const tableToExport = divToExport.lastChild;

        // estilizando a tabela para o texto ficar maior no PDF
        const lastFontSize = tableToExport.style.fontSize;
        tableToExport.style.fontSize = '12px';        

        // imprime os elementos a serem impressos no PDF (nome da sala - tabela)
        pdf.text(title, 14, 15);
        pdf.autoTable({ html: tableToExport, useCss: true, startY: 20 });

        // retorna o tamanho do texto da tabela para o tamanho original da pagina
        tableToExport.style.fontSize = lastFontSize;

        // evita criar ultima pagina em branco
        if (i < table_ids.length - 1) {
            // cria uma nova pagina para a proxima tabela
            pdf.addPage("a4", "landscape");
        }
    
    }

     // salva o pdf
     pdf.save("mapas_sala_car_ufes.pdf");
}