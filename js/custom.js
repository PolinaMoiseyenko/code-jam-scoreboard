const createRowElement = function (value) {
    const td = document.createElement('td');
    td.appendChild(document.createTextNode(value));
    return td;
}

const createCheckbox = function () {
    const chb = document.createElement('input');
    chb.setAttribute('type', 'checkbox');
    chb.setAttribute('class', 'chb');
    chb.setAttribute('onclick', 'checkLimit()');
    return chb;
}

function checkLimit() {
    const checkbox = document.querySelectorAll('input.chb');
    let count = 0;
    for (let i = 0; i < checkbox.length; i++){
        if (checkbox[i].checked === true) {
            count++;
        }
        if (count > 10) {
            checkbox[i].checked = false;
        }
    }    
}

function createTable(users, sessions, sessionNumber) {
    const headerArray = ['Participant name', 'Total time', 'Comparison'];
    const table = document.getElementById('scoretable');
    const trHeader = document.createElement('tr');
    
    trHeader.appendChild(createRowElement(headerArray[0]));
    for (let i = 0; i < sessions[sessionNumber].puzzles.length; i++) {
        trHeader.appendChild(createRowElement(sessions[sessionNumber].puzzles[i].name));
    }
    trHeader.appendChild(createRowElement(headerArray[1]));
    trHeader.appendChild(createRowElement(headerArray[2]));
    table.appendChild(trHeader);

    for (let i = 0; i < users.length; i++) {
        let totalTime = 0;
        const trRow = document.createElement('tr');
        trRow.appendChild(createRowElement(users[i].displayName));
        for (let j = 0; j < sessions[sessionNumber].rounds.length; j++) {
            let active = false;
            _.each(sessions[sessionNumber].rounds[j].solutions, function (item, index) {
                if (index === users[i].uid && item.correct === 'Correct') {
                    trRow.appendChild(createRowElement(item.time.$numberLong));
                    totalTime += parseInt(item.time.$numberLong);
                    active = true;
                }
                if (index === users[i].uid && item.correct === 'Incorrect') {
                    trRow.appendChild(createRowElement('150'));
                    totalTime += 150;
                    active = true;
                }
            });
            if (active === false) {
                trRow.appendChild(createRowElement('n/a'));    // n/a = no answer
                totalTime += 150;
            }
        }
        if (sessions[sessionNumber].rounds.length === 0) {
            trRow.appendChild(createRowElement('n/a'));
        }
        if (totalTime !== 1500 && totalTime !== 0) {
            trRow.appendChild(createRowElement(totalTime));
        } else trRow.appendChild(createRowElement('n/a'))
        trRow.appendChild(createCheckbox());
        table.appendChild(trRow);
    }
    if (sessions[sessionNumber].rounds.length === 0) {
        alert('RSSchool-demo was not held!');
    }
    const checkbox = document.getElementsByClassName('chb');
    table.addEventListener('change', e => {
        if(e.target.tagname = 'input') {
            if(e.target.checked) {
                const data = [];
                for (let i = 1; i < sessions[sessionNumber].rounds.length; i++) {
                data.push(e.target.parentNode.children[i].outerText);
            }
            let color = colors[Math.floor(Math.random()*colors.length)];
            const newUser = {
                label: e.target.parentNode.children[0].outerText,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
                fill: false
            };
            chartConfig.data.datasets.push(newUser);
            chart.update();
            }
            else {
                chartConfig.data.datasets.pop();
                chart.update();
            }            
        }
    })
}

function showTable() {
    const table = document.getElementById('scoretable');
    const radioButton1 = document.getElementById('radioButton1');
    radioButton1.addEventListener('change', e => {
        if (e.target.checked) {
            table.innerHTML = '';
            createTable(users, sessions, 0);
        }
    })
    const radioButton2 = document.getElementById('radioButton2');
    radioButton2.addEventListener('change', e => {
        if (e.target.checked) {
            table.innerHTML = '';
            createTable(users, sessions, 1);
        }
    })
}

showTable();

const colors = ['#ff5a47', '#9b111e', '#7749D4', '#3732DA', '#7AC6FF', '#4FF0D5', '#4FF074', '#80DA60', '#F2FF72', '#FFC12F']
const canvas = document.getElementById('chart');
const chart = new Chart(canvas, chartConfig = {
    type: 'line',
    data: {
        labels: ['Matching Game', 'Matching Game II', 'Classy', 'Articles Everywhere', 'Anchor', 'Signing Up', 'Linear', 'Envious Heirs', 'Mariana', 'Tech Stack'],
        datasets: []
    },
    options: {
        title: {
            display: true,
            text: 'Results chart'
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true               
                }
            }]
        }
    }
});



