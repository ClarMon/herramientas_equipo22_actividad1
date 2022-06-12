const csvGrafica1 = "infracciones_por_trafico_de_drogas.csv";
const widthGrafica1 = 680;
const heightGrafica1 = 300;

//Agrega el encabezado de la página
function getEncabezado(titulo) {
    d3.select("body")
    .append("h1")
    .text(titulo)
    .attr("style", "color: #0098CD")
    .append("hr")
    .attr("style", "border-top: 1px dashed #2b506e; margin: 15");
}

//Función genérica para los títulos y subtítulos de gráficas
function getTituloGrafica(idDiv, titulo, subtitulo) {
    //Título
    d3.select("#seccion1")
    .attr("class", "col-sm-12 col-md-10 col-lg-6")
    .append("div")
    .attr("id", idDiv)
    .attr("style", "color: #2b506e; width: " + widthGrafica1);

    //Título
    d3.select("#" + idDiv)
    .append("h3")
    .text(titulo)
    .attr("class", "negrita ajustaMargen");

    //Subtítulo
    d3.select("#" + idDiv)
    .append("h5")
    .text(subtitulo)
    .attr("class", "negrita ajustaMargen");
}

//Genera gráfica de líneas sobre infracciones
function getGrafica1(idGrafica, idComentario){
    //Establece las dimensiones y márgenes del gráfico
    var margin = {top: 30, right: 30, bottom: 30, left: 50};
    var width = widthGrafica1 - margin.left - margin.right;
    var height = heightGrafica1 - margin.top - margin.bottom;
    
    //Establece las escalas y rangos para los ejes x, y
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    
    //Parsea las fechas en base al año
    var parseTime = d3.timeParse("%Y");
    
    //Crea el eje X, formateando las fechas para solo mostrar el año
    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));
        
    //Crea el eje y
    var yAxis = d3.axisLeft().scale(y);
    
    //Base para las líneas de unión
    var linea = d3.line()
                .x(function(d) { return x(d.anio); })
                .y(function(d) { return y(d.infracciones); });

    //Crea la figura svg de acuerrdo a las dimenciones establecidas
    var svg = d3.select("#seccion1")
                .append("div")
                .attr("id", idGrafica)
                .attr("width", width + margin.left + margin.right)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Lee los datos del archivo CSV y genera la gráfica 1
    d3.csv(csvGrafica1, function(error, data) {
        if (error) throw error;

        //Recorre los datos y formatea, de cadena a fecha y número
        data.forEach(function(d, i) {
            d.anio = parseTime(d.anio);
            d.infracciones = parseFloat(d.infracciones);

            //Agrega elementos al arreglo que se usarán para mostrar el detalle de los puntos
            d.anioAnterior = (i > 0 ? data[i-1].anio : 0);
            d.difAnioAnterior = parseFloat(d.infracciones) - (i > 0 ? parseFloat(data[i-1].infracciones) : 0);
            d.anioSiguiente = (i < data.length-1 ? data[i+1].anio : 0);
            d.difAnioSiguiente = parseFloat(d.infracciones) - (i < data.length-1 ? parseFloat(data[i+1].infracciones) : 0);
        });
    
        //Establece el rango de los datos en x, y
        x.domain(d3.extent(data, function(d) {
            return d.anio;
        }));
        y.domain([2500, d3.max(data, function(d) {
            return d.infracciones;
        })]);
    
        //Agrega las líneas y da formato con la clase linea
        svg.append("path")
            .data([data])
            .attr("class", "linea")
            .attr("d", linea);
    
        //Agrega el eje x formateado
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        //Agrega el eje y
        svg.append("g").call(yAxis);

        //Agrega los punto de intersección de los ejes
        svg.selectAll(".bubble")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d){return x(d.anio);})
            .attr("cy", function(d){return y(d.infracciones);})
            .attr("r", "3px")
            .attr("class", "punto")
            .on("click", function(d){showDetallePunto(d, idComentario)})
            .style("fill", "#2b506e")
            .append("svg:title")
            .text(function(d){return d3.format(",.2r")(d.infracciones);});
      });    
}

//Agrega la fuente de informaión de la gráfica
function getFuenteGrafica(idFuente, desc, fuente) {
    var ancho = document.getElementById(idFuente).getAttribute("width") - 10;

    d3.select("#" + idFuente)
        .append("p")
        .text("Fuente: ")
        .attr("class", "negrita ajustaMargen")
        .attr("style", "text-align: right; width: " + ancho)
        .append("label")
        .text(desc)
        .attr("class", "normal")
        .append("a")
        .text(fuente)
        .attr("class", "normal")
        .attr("href", "https://" + fuente)
        .attr("target", "_blank");
}

//Función genérica para la descripción de las gráficas
function getDescGrafica(idDiv, encabezado, cuerpo, detalle, descDetalle) {
    var ancho = widthGrafica1 - 10;

    //Crea el div contenedor
    d3.select("#seccion1")
        .append("div")
        .attr("id", idDiv)
        .attr("class", "comentario")
        .attr("style", "width: " + ancho);
    
    //Encabezado del comentario
    d3.select("#"+idDiv)
        .append("p")
        .text(encabezado)
        .attr("class", "negrita ajustaMargen");

    //Cuerpo del comentario
    d3.select("#"+idDiv)
        .append("p")
        .text(cuerpo)
        .attr("class", "normal ajustaMargen");

    //Agrega una etiqueta para mas detalle
    if(detalle){
        d3.select("#" + idDiv)
            .append("p");

        d3.select("#" + idDiv)
            .append("p")
            .text(descDetalle)
            .attr("class", "negrita ajustaMargen");
    }
}

//Muestra el detalle del punto elegido en la gráfica
function showDetallePunto(data, idComentario){
    var ancho = widthGrafica1 - 20;

    //Elimina el detalle del item, esto si ya había sido mostrada la información de alguno
    remove("detalleItem");

    //Agrega detalle de cada item en la sección de comentario
    d3.select("#" + idComentario)
        .append("div")
        .attr("id", "detalleItem")
        .attr("class", "ajustaMargen detalle")
        .attr("style", "width: " + ancho);

    d3.select("#detalleItem")
        .append("h4")
        .text("Primer trimestre del año: " + data.anio.getFullYear())
        .attr("class", "negrita ajustaMargen");

    d3.select("#detalleItem")
        .append("p")
        .text("Total de infracciones en el año: ")
        .attr("class", "negrita ajustaMargen")
        .append("label")
        .text(d3.format(",.2r")(data.infracciones))
        .attr("class", "normal ajustaMargen");

    if(data.anioAnterior > 0)
        d3.select("#detalleItem")
            .append("p")
            .text("Diferencia respecto al año " + data.anioAnterior.getFullYear() + ": ")
            .attr("class", "negrita ajustaMargen")
            .append("label")
            .text(d3.format(",.2r")(data.difAnioAnterior) + " infracciones.")
            .attr("class", "normal ajustaMargen");

    if(data.anioSiguiente > 0)
        d3.select("#detalleItem")
            .append("p")
            .text("Diferencia respecto al año " + data.anioSiguiente + ": ")
            .attr("class", "negrita ajustaMargen")
            .append("label")
            .text(d3.format(",.2r")(data.difAnioSiguiente) + " infracciones.")
            .attr("class", "normal ajustaMargen");
}   

//Elimina un elemento del html por id
function remove(id){
    var element = document.getElementById(id);
    if(element)
        return element.parentNode.removeChild(element);
}

