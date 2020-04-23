var n = 0, quantum = 0;
var mat = new Array();
var runTime = 0;
function createTable() {
    var row = document.getElementById("process");
    var column = 5;
    
    if (row.value.length == 0) {
      alert("Vui lòng nhập vào số tiến trình");
            return false;
    } else if (isNaN(row.value)) {
            alert("Vui lòng nhập giá trị số tiến trình");
            return false;
    } else {
        var calButton = document.getElementById("calculate");
        calButton.disabled = false;

        var container = document.getElementById("container");
        container.innerHTML = "";
    
        var countRow = parseInt(row.value);
        var countColumn = column;
        n = countRow;
    
        var tagTable = document.createElement("table");
        tagTable.border = 1;

        var headerRow = document.createElement("tr");
        headerRow.style.textAlign = "center";
        tagTable.appendChild(headerRow);

        var headerID = document.createElement("td");
        headerID.appendChild(document.createTextNode("Process ID"));
        headerRow.appendChild(headerID);

        var headerArrival = document.createElement("td");
        headerArrival.appendChild(document.createTextNode("Arrival Time"));
        headerRow.appendChild(headerArrival);

        var headerBurst = document.createElement("td");
        headerBurst.appendChild(document.createTextNode("Burst Time"));
        headerRow.appendChild(headerBurst);

        var headerOrder = document.createElement("td");
        headerOrder.appendChild(document.createTextNode("Order"));
        headerRow.appendChild(headerOrder);

        var headerQNumber = document.createElement("td");
        headerQNumber.appendChild(document.createTextNode("Queue Number"));
        headerRow.appendChild(headerQNumber);
        
        for (var i = 0; i < countRow; i++) {
            var id = i+1;
            var tagRow = document.createElement("tr");
            tagTable.appendChild(tagRow);
                
            for(var j = 0; j < countColumn; j++) {                 

                var tagColumn = document.createElement("td");    
                tagRow.appendChild(tagColumn);
                    
                if (j != 0) {
                    var textBox = document.createElement("input");          
                    tagColumn.appendChild(textBox);   
                    textBox.style.width = "100px";      
                    textBox.style.border = "none";     
                    switch (j) {
                        case 1:
                            textBox.id = "p"+id+"-arrival";
                            break;
                        case 2:
                            textBox.id = "p"+id+"-burst";
                            break;
                        case 3:
                            textBox.id = "p"+id+"-order";
                            break;
                        case 4:
                            textBox.id = "p"+id+"-queue"; 
                            textBox.style.width = "120px";  
                            break;
                    }
                } else {
                    tagColumn.style.textAlign = "center";
                    tagColumn.appendChild(document.createTextNode("P"+id));
                }      
            }
        }

        var quantumRow = document.createElement("tr");
        tagTable.appendChild(quantumRow);

        var quantumLabelCol = document.createElement("td");
        quantumLabelCol.colSpan = 4;
        quantumLabelCol.appendChild(document.createTextNode("Quantum"));
        quantumLabelCol.style.textAlign = "center";
        quantumRow.appendChild(quantumLabelCol);

        var quantumValueCol = document.createElement("td");
        quantumRow.appendChild(quantumValueCol);
        var textBox = document.createElement("input"); 
        quantumValueCol.appendChild(textBox);

        textBox.style.width = "120px";              
        textBox.style.border = "none";       
        textBox.id = "quantum";
    
        container.appendChild(tagTable);
      
        return true;
    }
}

function solveData() {
    runTime = 0;
    mat = new Array();
    for (var i = 0; i < n; i++) {
        var pId = "p" + (i + 1);
        mat[i] = {
            pId: i,
            arrival: getValue(document.getElementById(pId + "-arrival")),
            burst: getValue(document.getElementById(pId + "-burst")),
            order: getValue(document.getElementById(pId + "-order")),
            queue: getValue(document.getElementById(pId + "-queue")),
            waitingTime: 0,
            responseTime: -1,
            turnaroundTime: 0
        }        
    }
    quantum = getValue(document.getElementById("quantum"));

    //Arrange Arrival
    mat.sort((a, b) => a.arrival - b.arrival);
    for (var i = 0; i < n; i++) {        
        if (runTime < mat[i].arrival) {
            runTime = mat[i].arrival;
        }
        runTime += mat[i].burst;
    }

    FCFS();
    SJF();
    SRTF();
    PS();
    PS_PRE();
    RR();
    HRRN();

    return true;
}

function HRRN() {
    var temp = $.extend(true, [], mat);
    var queue = new Array();
    var runningTime = 0;
    var waitingTime = 0;
    var responseTime = 0;
    var turnaroundTime = 0;
    var textGantt = "Text Gantt: 0";

    var ganttRow = document.createElement("tr");
    ganttRow.bgColor = "#4CAF50";
    ganttRow.style.textAlign = "center";
    
    var timingRow = document.createElement("tr");

    var currentProcess = temp[0];
    
    for (var i = 0; i < n; i++) {
        if (runningTime < currentProcess.arrival) {   
            var pLabel = document.createElement("td");
            pLabel.appendChild(document.createTextNode("FREE"));
            pLabel.style.width = ((currentProcess.arrival - runningTime)/runTime*800) + "px";
            pLabel.style.border = "1px solid #000";
            pLabel.bgColor = "#fff";
            
            var timeLabel = document.createElement("td");
            timeLabel.appendChild(document.createTextNode(runningTime));
            timeLabel.style.borderLeft = "1px solid #000";
            timeLabel.style.borderRight = "1px solid #000";

            ganttRow.appendChild(pLabel);
            timingRow.appendChild(timeLabel);

            runningTime = currentProcess.arrival;
        }

        var pLabel = document.createElement("td");
        pLabel.appendChild(document.createTextNode("P"+(currentProcess.pId + 1)));
        pLabel.style.width = (currentProcess.burst/runTime*800) + "px";
        pLabel.style.border = "1px solid #000";
        
        var timeLabel = document.createElement("td");
        timeLabel.appendChild(document.createTextNode(runningTime));
        timeLabel.style.borderLeft = "1px solid #000";
        timeLabel.style.borderRight = "1px solid #000";

        ganttRow.appendChild(pLabel);
        timingRow.appendChild(timeLabel);        

        for (var j = 0; j < n; j++) {
            if (temp[j].burst > 0  && temp[j].pId != currentProcess.pId) {
                // console.log("P"+temp[j].pId + ": " + temp[j].arrival + "/" + runningTime);
                if (temp[j].arrival >= runningTime && temp[j].arrival < runningTime + currentProcess.burst) {
                    queue.push(temp[j]);
                    console.log("P"+temp[j].pId);
                }
            }
        }
        // console.log("-------------------");

        currentProcess.waitingTime = runningTime - currentProcess.arrival;
        currentProcess.responseTime = runningTime - currentProcess.arrival;
        currentProcess.turnaroundTime = currentProcess.responseTime + currentProcess.burst;
        runningTime += currentProcess.burst;
        waitingTime += currentProcess.waitingTime;
        responseTime += currentProcess.responseTime;
        turnaroundTime += currentProcess.turnaroundTime;

        textGantt = textGantt + " – P" + (currentProcess.pId + 1) + " – " + runningTime;

        currentProcess.burst = 0;

        queue.sort((a, b) => {
            var tspenWA = runningTime - a.arrival;
            var tspenWB = runningTime - b.arrival;
            var rrA = (tspenWA + a.burst)/a.burst;
            var rrB = (tspenWB + b.burst)/b.burst;
            if (rrA == rrB) {
                return a.burst - b.burst;
            }
            return rrB - rrA;
        });
        currentProcess = queue.shift();
        if (currentProcess == null) {
            for (var j = 0; j < n; j++) {
                if (temp[j].arrival >= runningTime) {
                    currentProcess = temp[j];
                    break;
                }
            }
        }
    }    

    temp.sort((a, b) => a.pId - b.pId);

    var timeLabel = document.createElement("td");
    timeLabel.appendChild(document.createTextNode(runningTime));
    timingRow.appendChild(timeLabel);
    
    var ganttTable = document.createElement("table");
    ganttTable.style.margin = "20px auto";
    ganttTable.appendChild(ganttRow);
    ganttTable.appendChild(timingRow);

    var container = document.getElementById("hrrn");
    container.appendChild(ganttTable);
    container.appendChild(document.createTextNode(textGantt));

    //Print data
    showResult(temp, waitingTime, responseTime, turnaroundTime, container);
}

function RR() {
    if (quantum <= 0) return;
    var temp = $.extend(true, [], mat);
    var queue = new Array();
    var runningTime = 0;
    var waitingTime = 0;
    var responseTime = 0;
    var turnaroundTime = 0;
    var textGantt = "Text Gantt: 0";

    var ganttRow = document.createElement("tr");
    ganttRow.bgColor = "#4CAF50";
    ganttRow.style.textAlign = "center";
    
    var timingRow = document.createElement("tr");

    var currentProcess = temp[0];
    var nextStop = min(quantum, currentProcess.burst);

    while (runningTime < runTime) {
        if (runningTime < currentProcess.arrival) {   
            var pLabel = document.createElement("td");
            pLabel.appendChild(document.createTextNode("FREE"));
            pLabel.style.width = ((currentProcess.arrival - runningTime)/runTime*800) + "px";
            pLabel.style.border = "1px solid #000";
            pLabel.bgColor = "#fff";
            
            var timeLabel = document.createElement("td");
            timeLabel.appendChild(document.createTextNode(runningTime));
            timeLabel.style.borderLeft = "1px solid #000";
            timeLabel.style.borderRight = "1px solid #000";

            ganttRow.appendChild(pLabel);
            timingRow.appendChild(timeLabel);

            runningTime = currentProcess.arrival;
        }
        var pLabel = document.createElement("td");
        pLabel.appendChild(document.createTextNode("P"+(currentProcess.pId + 1)));
        pLabel.style.width = (nextStop/runTime*800) + "px";
        pLabel.style.border = "1px solid #000";
        
        var timeLabel = document.createElement("td");
        timeLabel.appendChild(document.createTextNode(runningTime));
        timeLabel.style.borderLeft = "1px solid #000";
        timeLabel.style.borderRight = "1px solid #000";

        ganttRow.appendChild(pLabel);
        timingRow.appendChild(timeLabel);

        for (var i = 0; i < n; i++) {
            if (temp[i].burst > 0 && temp[i].pId != currentProcess.pId && !queue.includes(temp[i])) {
                if (temp[i].arrival >= runningTime && temp[i].arrival <= runningTime + nextStop) {
                    queue.push(temp[i]);
                    console.log("in running, push: "+temp[i].pId + ", burst: " + temp[i].burst);
                }
            }
        }
        

        currentProcess.waitingTime += runningTime - currentProcess.arrival;
        if (currentProcess.responseTime == -1) {
            currentProcess.responseTime = runningTime - currentProcess.arrival;
            responseTime += currentProcess.responseTime;
        }
        runningTime += nextStop;
        
        currentProcess.arrival = runningTime;
        currentProcess.burst -= nextStop;

        textGantt = textGantt + " – P" + (currentProcess.pId + 1) + " – " + runningTime;

        if (currentProcess.burst > 0) {
            queue.push(currentProcess);
            console.log("after running, push: "+currentProcess.pId + ", burst: " + currentProcess.burst);
        }
        console.log("--------------------------");

        var t = queue.shift();  
        console.log(t== null);      
        if (t != null) {
            currentProcess = t;
        } else {
            if (currentProcess.burst <= 0) {
                for (var i = 0; i < n; i++) {
                    if (temp[i].burst > 0) {
                        if (temp[i].arrival >= runningTime) {
                            currentProcess = temp[i];
                            break;
                        }
                    }
                }
            }
        }
        nextStop = min(quantum, currentProcess.burst);  
    }

    for (var i = 0; i < n; i++) {
        temp[i].turnaroundTime = temp[i].arrival - mat[i].arrival;
        turnaroundTime += temp[i].turnaroundTime;
        waitingTime += temp[i].waitingTime;
    }

    temp.sort((a, b) => a.pId - b.pId);

    var timeLabel = document.createElement("td");
    timeLabel.appendChild(document.createTextNode(runningTime));
    timingRow.appendChild(timeLabel);
    
    var ganttTable = document.createElement("table");
    ganttTable.style.margin = "20px auto";
    ganttTable.appendChild(ganttRow);
    ganttTable.appendChild(timingRow);

    var container = document.getElementById("rr");
    container.appendChild(ganttTable);
    container.appendChild(document.createTextNode(textGantt));

    //Print data
    showResult(temp, waitingTime, responseTime, turnaroundTime, container);
}

function PS_PRE() {
    var temp = $.extend(true, [], mat);
    var runningTime = 0;
    var waitingTime = 0;
    var responseTime = 0;
    var turnaroundTime = 0;
    var textGantt = "Text Gantt: 0";

    var ganttRow = document.createElement("tr");
    ganttRow.bgColor = "#4CAF50";
    ganttRow.style.textAlign = "center";
    
    var timingRow = document.createElement("tr");

    var currentProcess = temp[0];
    var nextStop = currentProcess.burst;

    for (var i = 0; i < n; i++) {
        if (temp[i].arrival > runningTime && temp[i].arrival - runningTime <= nextStop) {
            if (temp[i].order < currentProcess.order) {
                nextStop = temp[i].arrival - runningTime;
                break;
            }
        }     
    }

    while (runningTime < runTime) {
        if (runningTime < currentProcess.arrival) {   
            var pLabel = document.createElement("td");
            pLabel.appendChild(document.createTextNode("FREE"));
            pLabel.style.width = ((currentProcess.arrival - runningTime)/runTime*800) + "px";
            pLabel.style.border = "1px solid #000";
            pLabel.bgColor = "#fff";
            
            var timeLabel = document.createElement("td");
            timeLabel.appendChild(document.createTextNode(runningTime));
            timeLabel.style.borderLeft = "1px solid #000";
            timeLabel.style.borderRight = "1px solid #000";

            ganttRow.appendChild(pLabel);
            timingRow.appendChild(timeLabel);

            runningTime = currentProcess.arrival;
        }
        var pLabel = document.createElement("td");
        pLabel.appendChild(document.createTextNode("P"+(currentProcess.pId + 1)));
        pLabel.style.width = (nextStop/runTime*800) + "px";
        pLabel.style.border = "1px solid #000";
        
        var timeLabel = document.createElement("td");
        timeLabel.appendChild(document.createTextNode(runningTime));
        timeLabel.style.borderLeft = "1px solid #000";
        timeLabel.style.borderRight = "1px solid #000";

        ganttRow.appendChild(pLabel);
        timingRow.appendChild(timeLabel);

        currentProcess.waitingTime += runningTime - currentProcess.arrival;
        if (currentProcess.responseTime == -1) {
            currentProcess.responseTime = runningTime - currentProcess.arrival;
            responseTime += currentProcess.responseTime;
        }
        runningTime += nextStop;
        
        currentProcess.arrival = runningTime;
        currentProcess.burst -= nextStop;

        textGantt = textGantt + " – P" + (currentProcess.pId + 1) + " – " + runningTime;

        mat.sort((a, b) => a.arrival - b.arrival);
        for (var i = 0; i < n; i++) {
            if (temp[i].burst > 0) {
                if (currentProcess.burst <= 0) {
                    currentProcess = temp[i];
                }
                if (temp[i].arrival <= runningTime && temp[i].order < currentProcess.order) {
                    currentProcess = temp[i];
                } 
            }           
        }
        nextStop = currentProcess.burst;
        
        for (var i = 0; i < n; i++) {
            if (temp[i].arrival > runningTime && temp[i].arrival - runningTime <= nextStop) {
                if (temp[i].order < currentProcess.order) {
                    nextStop = temp[i].arrival - runningTime;
                    break;
                }
            }     
        }
    }

    for (var i = 0; i < n; i++) {
        temp[i].turnaroundTime = temp[i].arrival - mat[i].arrival;
        turnaroundTime += temp[i].turnaroundTime;
        waitingTime += temp[i].waitingTime;
    }

    temp.sort((a, b) => a.pId - b.pId);

    var timeLabel = document.createElement("td");
    timeLabel.appendChild(document.createTextNode(runningTime));
    timingRow.appendChild(timeLabel);
    
    var ganttTable = document.createElement("table");
    ganttTable.style.margin = "20px auto";
    ganttTable.appendChild(ganttRow);
    ganttTable.appendChild(timingRow);

    var container = document.getElementById("ps-pre");
    container.appendChild(ganttTable);
    container.appendChild(document.createTextNode(textGantt));

    //Print data
    showResult(temp, waitingTime, responseTime, turnaroundTime, container);
}

function PS() {
    var temp = $.extend(true, [], mat);
    var data = new Array();
    var runningTime = 0;
    var waitingTime = 0;
    var responseTime = 0;
    var turnaroundTime = 0;
    var textGantt = "Text Gantt: 0";

    var ganttRow = document.createElement("tr");
    ganttRow.bgColor = "#4CAF50";
    ganttRow.style.textAlign = "center";
    
    var timingRow = document.createElement("tr");

    var currentProcess = temp[0];
    delete temp[0];
    
    for (var i = 0; i < n; i++) {
        if (runningTime < currentProcess.arrival) {   
            var pLabel = document.createElement("td");
            pLabel.appendChild(document.createTextNode("FREE"));
            pLabel.style.width = ((currentProcess.arrival - runningTime)/runTime*800) + "px";
            pLabel.style.border = "1px solid #000";
            pLabel.bgColor = "#fff";
            
            var timeLabel = document.createElement("td");
            timeLabel.appendChild(document.createTextNode(runningTime));
            timeLabel.style.borderLeft = "1px solid #000";
            timeLabel.style.borderRight = "1px solid #000";

            ganttRow.appendChild(pLabel);
            timingRow.appendChild(timeLabel);

            runningTime = currentProcess.arrival;
        }

        var pLabel = document.createElement("td");
        pLabel.appendChild(document.createTextNode("P"+(currentProcess.pId + 1)));
        pLabel.style.width = (currentProcess.burst/runTime*800) + "px";
        pLabel.style.border = "1px solid #000";
        
        var timeLabel = document.createElement("td");
        timeLabel.appendChild(document.createTextNode(runningTime));
        timeLabel.style.borderLeft = "1px solid #000";
        timeLabel.style.borderRight = "1px solid #000";

        ganttRow.appendChild(pLabel);
        timingRow.appendChild(timeLabel);


        currentProcess.waitingTime = runningTime - currentProcess.arrival;
        currentProcess.responseTime = runningTime - currentProcess.arrival;
        currentProcess.turnaroundTime = currentProcess.responseTime + currentProcess.burst;
        runningTime += currentProcess.burst;
        waitingTime += currentProcess.waitingTime;
        responseTime += currentProcess.responseTime;
        turnaroundTime += currentProcess.turnaroundTime;

        textGantt = textGantt + " – P" + (currentProcess.pId + 1) + " – " + runningTime;

        data.push(currentProcess);

        var min = 2147483647;
        var place = -1;
        for (var j = 0; j < n; j++) {
            if (temp[j] != null && temp[j].arrival <= runningTime && temp[j].order < min) {
                currentProcess = temp[j];
                min = currentProcess.order;
                place = j;
            }
        }        
        if (place < 0) {            
            for (var j = 0; j < n; j++) {
                if (temp[j] != null) {
                    currentProcess = temp[j];
                    place = j;
                    break;
                }
            }
        }
        if (place >= 0) delete temp[place];
    }    

    data.sort((a, b) => a.pId - b.pId);

    var timeLabel = document.createElement("td");
    timeLabel.appendChild(document.createTextNode(runningTime));
    timingRow.appendChild(timeLabel);
    
    var ganttTable = document.createElement("table");
    ganttTable.style.margin = "20px auto";
    ganttTable.appendChild(ganttRow);
    ganttTable.appendChild(timingRow);

    var container = document.getElementById("ps");
    container.appendChild(ganttTable);
    container.appendChild(document.createTextNode(textGantt));

    //Print data
    showResult(data, waitingTime, responseTime, turnaroundTime, container);
}

function SRTF() {
    var temp = $.extend(true, [], mat);
    var runningTime = 0;
    var waitingTime = 0;
    var responseTime = 0;
    var turnaroundTime = 0;
    var textGantt = "Text Gantt: 0";

    var ganttRow = document.createElement("tr");
    ganttRow.bgColor = "#4CAF50";
    ganttRow.style.textAlign = "center";
    
    var timingRow = document.createElement("tr");

    var currentProcess = temp[0];
    var nextStop = currentProcess.burst;

    for (var i = 0; i < n; i++) {
        if (temp[i].arrival > runningTime && temp[i].arrival - runningTime <= nextStop) {
            if (temp[i].burst < currentProcess.burst - (temp[i].arrival - runningTime)) {
                nextStop = temp[i].arrival - runningTime;
                break;
            }
        }     
    }

    while (runningTime < runTime) {
        if (runningTime < currentProcess.arrival) {   
            var pLabel = document.createElement("td");
            pLabel.appendChild(document.createTextNode("FREE"));
            pLabel.style.width = ((currentProcess.arrival - runningTime)/runTime*800) + "px";
            pLabel.style.border = "1px solid #000";
            pLabel.bgColor = "#fff";
            
            var timeLabel = document.createElement("td");
            timeLabel.appendChild(document.createTextNode(runningTime));
            timeLabel.style.borderLeft = "1px solid #000";
            timeLabel.style.borderRight = "1px solid #000";

            ganttRow.appendChild(pLabel);
            timingRow.appendChild(timeLabel);

            runningTime = currentProcess.arrival;
        }
        var pLabel = document.createElement("td");
        pLabel.appendChild(document.createTextNode("P"+(currentProcess.pId + 1)));
        pLabel.style.width = (nextStop/runTime*800) + "px";
        pLabel.style.border = "1px solid #000";
        
        var timeLabel = document.createElement("td");
        timeLabel.appendChild(document.createTextNode(runningTime));
        timeLabel.style.borderLeft = "1px solid #000";
        timeLabel.style.borderRight = "1px solid #000";

        ganttRow.appendChild(pLabel);
        timingRow.appendChild(timeLabel);

        currentProcess.waitingTime += runningTime - currentProcess.arrival;
        if (currentProcess.responseTime == -1) {
            currentProcess.responseTime = runningTime - currentProcess.arrival;
            responseTime += currentProcess.responseTime;
        }
        runningTime += nextStop;
        
        currentProcess.arrival = runningTime;
        currentProcess.burst -= nextStop;

        textGantt = textGantt + " – P" + (currentProcess.pId + 1) + " – " + runningTime;

        mat.sort((a, b) => a.arrival - b.arrival);
        for (var i = 0; i < n; i++) {
            if (temp[i].burst > 0) {
                if (currentProcess.burst <= 0) {
                    currentProcess = temp[i];
                }
                if (temp[i].arrival <= runningTime && temp[i].burst < currentProcess.burst) {
                    currentProcess = temp[i];
                } 
            }           
        }
        nextStop = currentProcess.burst;
        
        for (var i = 0; i < n; i++) {
            if (temp[i].arrival > runningTime && temp[i].arrival - runningTime <= nextStop) {
                if (temp[i].burst < currentProcess.burst - (temp[i].arrival - runningTime)) {
                    nextStop = temp[i].arrival - runningTime;
                    break;
                }
            }     
        }
    }

    for (var i = 0; i < n; i++) {
        temp[i].turnaroundTime = temp[i].arrival - mat[i].arrival;
        turnaroundTime += temp[i].turnaroundTime;
        waitingTime += temp[i].waitingTime;
    }

    temp.sort((a, b) => a.pId - b.pId);

    var timeLabel = document.createElement("td");
    timeLabel.appendChild(document.createTextNode(runningTime));
    timingRow.appendChild(timeLabel);
    
    var ganttTable = document.createElement("table");
    ganttTable.style.margin = "20px auto";
    ganttTable.appendChild(ganttRow);
    ganttTable.appendChild(timingRow);

    var container = document.getElementById("srtf");
    container.appendChild(ganttTable);
    container.appendChild(document.createTextNode(textGantt));

    //Print data
    showResult(temp, waitingTime, responseTime, turnaroundTime, container);
}

function SJF() {
    var temp = $.extend(true, [], mat);
    var data = new Array();
    var runningTime = 0;
    var waitingTime = 0;
    var responseTime = 0;
    var turnaroundTime = 0;
    var textGantt = "Text Gantt: 0";

    var ganttRow = document.createElement("tr");
    ganttRow.bgColor = "#4CAF50";
    ganttRow.style.textAlign = "center";
    
    var timingRow = document.createElement("tr");

    var currentProcess = temp[0];
    delete temp[0];
    
    for (var i = 0; i < n; i++) {
        if (runningTime < currentProcess.arrival) {   
            var pLabel = document.createElement("td");
            pLabel.appendChild(document.createTextNode("FREE"));
            pLabel.style.width = ((currentProcess.arrival - runningTime)/runTime*800) + "px";
            pLabel.style.border = "1px solid #000";
            pLabel.bgColor = "#fff";
            
            var timeLabel = document.createElement("td");
            timeLabel.appendChild(document.createTextNode(runningTime));
            timeLabel.style.borderLeft = "1px solid #000";
            timeLabel.style.borderRight = "1px solid #000";

            ganttRow.appendChild(pLabel);
            timingRow.appendChild(timeLabel);

            runningTime = currentProcess.arrival;
        }
        var pLabel = document.createElement("td");
        pLabel.appendChild(document.createTextNode("P"+(currentProcess.pId + 1)));
        pLabel.style.width = (currentProcess.burst/runTime*800) + "px";
        pLabel.style.border = "1px solid #000";
        
        var timeLabel = document.createElement("td");
        timeLabel.appendChild(document.createTextNode(runningTime));
        timeLabel.style.borderLeft = "1px solid #000";
        timeLabel.style.borderRight = "1px solid #000";

        ganttRow.appendChild(pLabel);
        timingRow.appendChild(timeLabel);


        currentProcess.waitingTime = runningTime - currentProcess.arrival;
        currentProcess.responseTime = runningTime - currentProcess.arrival;
        currentProcess.turnaroundTime = currentProcess.responseTime + currentProcess.burst;
        runningTime += currentProcess.burst;
        waitingTime += currentProcess.waitingTime;
        responseTime += currentProcess.responseTime;
        turnaroundTime += currentProcess.turnaroundTime;  

        textGantt = textGantt + " – P" + (currentProcess.pId + 1) + " – " + runningTime;      

        data.push(currentProcess);

        var min = 2147483647;
        var place = -1;
        for (var j = 0; j < n; j++) {
            if (temp[j] != null && temp[j].arrival <= runningTime && temp[j].burst < min) {
                currentProcess = temp[j];
                min = currentProcess.burst;
                place = j;
            }
        }
        if (place < 0) {            
            for (var j = 0; j < n; j++) {
                if (temp[j] != null) {
                    currentProcess = temp[j];       
                    place = j;
                    break;
                }
            }
        }
        if (place >= 0) delete temp[place];
    }    

    data.sort((a, b) => a.pId - b.pId);

    var timeLabel = document.createElement("td");
    timeLabel.appendChild(document.createTextNode(runningTime));
    timingRow.appendChild(timeLabel);
    
    var ganttTable = document.createElement("table");
    ganttTable.style.margin = "20px auto";
    ganttTable.appendChild(ganttRow);
    ganttTable.appendChild(timingRow);

    var container = document.getElementById("sjf");
    container.appendChild(ganttTable);
    container.appendChild(document.createTextNode(textGantt));

    //Print data
    showResult(data, waitingTime, responseTime, turnaroundTime, container);
}

function FCFS() {
    var data = $.extend(true, [], mat);
    var runningTime = 0;
    var waitingTime = 0;
    var responseTime = 0;
    var turnaroundTime = 0;
    var textGantt = "Text Gantt: 0";

    var ganttRow = document.createElement("tr");
    ganttRow.bgColor = "#4CAF50";
    ganttRow.style.textAlign = "center";
    
    var timingRow = document.createElement("tr");

    for (var i = 0; i < n; i++) {
        if (runningTime < data[i].arrival) {   
            var pLabel = document.createElement("td");
            pLabel.appendChild(document.createTextNode("FREE"));
            pLabel.style.width = ((data[i].arrival - runningTime)/runTime*800) + "px";
            pLabel.style.border = "1px solid #000";
            pLabel.bgColor = "#fff";
            
            var timeLabel = document.createElement("td");
            timeLabel.appendChild(document.createTextNode(runningTime));
            timeLabel.style.borderLeft = "1px solid #000";
            timeLabel.style.borderRight = "1px solid #000";

            ganttRow.appendChild(pLabel);
            timingRow.appendChild(timeLabel);

            runningTime = data[i].arrival;
        }
        var pLabel = document.createElement("td");
        pLabel.appendChild(document.createTextNode("P"+(data[i].pId + 1)));
        pLabel.style.width = (data[i].burst/runTime*800) + "px";
        pLabel.style.border = "1px solid #000";
        
        var timeLabel = document.createElement("td");
        timeLabel.appendChild(document.createTextNode(runningTime));
        timeLabel.style.borderLeft = "1px solid #000";
        timeLabel.style.borderRight = "1px solid #000";

        ganttRow.appendChild(pLabel);
        timingRow.appendChild(timeLabel);

        //Data calculating
        data[i].waitingTime = runningTime - data[i].arrival;
        data[i].responseTime = runningTime - data[i].arrival;
        data[i].turnaroundTime = data[i].responseTime + data[i].burst;
        runningTime += data[i].burst;
        waitingTime += data[i].waitingTime;
        responseTime += data[i].responseTime;
        turnaroundTime += data[i].turnaroundTime;

        textGantt = textGantt + " – P" + (data[i].pId + 1) + " – " + runningTime;
    }    

    data.sort((a, b) => a.pId - b.pId);

    var timeLabel = document.createElement("td");
    timeLabel.appendChild(document.createTextNode(runningTime));
    timingRow.appendChild(timeLabel);
    
    var ganttTable = document.createElement("table");
    ganttTable.style.margin = "20px auto";
    ganttTable.appendChild(ganttRow);
    ganttTable.appendChild(timingRow);

    var container = document.getElementById("fcfs");
    container.appendChild(ganttTable);
    container.appendChild(document.createTextNode(textGantt));

    //Print data
    showResult(data, waitingTime, responseTime, turnaroundTime, container);
}

function getValue(inputElement) {
    if (inputElement.value.length == 0) {
        return -1;
    } else if (isNaN(inputElement.value)) {
        return -1;
    } else {
        return parseInt(inputElement.value);
    }
}

function showResult(data, waitingTime, responseTime, turnaroundTime, container) {
    var headerID = document.createElement("td");
    headerID.appendChild(document.createTextNode("Process ID"));
    headerID.style.padding = "0 5px";

    var headerWaiting = document.createElement("td");
    headerWaiting.appendChild(document.createTextNode("Waiting Time"));
    headerWaiting.style.padding = "0 5px";

    var headerResponse = document.createElement("td");
    headerResponse.appendChild(document.createTextNode("Response Time"));
    headerResponse.style.padding = "0 5px";

    var headerTurnaround = document.createElement("td");
    headerTurnaround.appendChild(document.createTextNode("Turnaround Time")); 
    headerTurnaround.style.padding = "0 5px";
    
    var headerRow = document.createElement("tr");
    headerRow.style.textAlign = "center";
    headerRow.appendChild(headerID);
    headerRow.appendChild(headerWaiting);
    headerRow.appendChild(headerResponse);
    headerRow.appendChild(headerTurnaround);   

    var tagTable = document.createElement("table");
    tagTable.style.textAlign = "center";
    tagTable.border = 1;
    tagTable.appendChild(headerRow);

    for (var i = 0; i < n; i++) {        
        var id = i+1;
        
        var pidColumn = document.createElement("td");    
        pidColumn.appendChild(document.createTextNode("P"+(data[i].pId+1)));

        var waitColumn = document.createElement("td");    
        waitColumn.appendChild(document.createTextNode(data[i].waitingTime));

        var responseColumn = document.createElement("td");  
        responseColumn.appendChild(document.createTextNode(data[i].responseTime));

        var turnaroundColumn = document.createElement("td"); 
        turnaroundColumn.appendChild(document.createTextNode(data[i].turnaroundTime));
        
        var tagRow = document.createElement("tr");
        tagRow.appendChild(pidColumn);
        tagRow.appendChild(waitColumn);
        tagRow.appendChild(responseColumn);
        tagRow.appendChild(turnaroundColumn);
        tagTable.appendChild(tagRow);
    }    

    var avgLCol = document.createElement("td");
    avgLCol.appendChild(document.createTextNode("Average"));

    var avgWCol = document.createElement("td");
    avgWCol.appendChild(document.createTextNode(waitingTime/n));

    var avgRCol = document.createElement("td");
    avgRCol.appendChild(document.createTextNode(responseTime/n));

    var avgTCol = document.createElement("td");
    avgTCol.appendChild(document.createTextNode(turnaroundTime/n));

    var avgRow = document.createElement("tr");
    tagTable.appendChild(avgRow);
    avgRow.appendChild(avgLCol);
    avgRow.appendChild(avgWCol);
    avgRow.appendChild(avgRCol);
    avgRow.appendChild(avgTCol);
    avgRow.bgColor = "#4CAF50";
    
    container.appendChild(tagTable);
    tagTable.style.marginLeft = "auto";
    tagTable.style.marginRight = "auto";
    tagTable.style.marginTop = "10px";
} 

function min(a, b) {
    return a < b ? a : b;
}
