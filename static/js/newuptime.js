getMonitorsByApi();

function getMonitorsByApi() {
    fetch("https://api.fjut.eu.org/getUptime.php?user=wKLkwH4ZG&type=0").then(res => {
        if (res.ok) {
            return res.json();
        } else {
            fetch("https://fjutwzk.heliohost.org/api/getUptime.php?user=wKLkwH4ZG&type=0").then(res1 => {
                if (res1.ok) {
                    return res.json();
                } else {
                    alert("Data acquisition failed, please refresh and try again!");
                    $fresh.textContent = "-";
                }
            }).then(res1 => {
                if (res1.stat === "ok") {
                    renderHTML(res1);
                }
            });
        }
    }).then(res => {
        if (res.stat === "ok") {
            renderHTML(res);
        }
    });
}

function renderHTML(res = {}) {
    let domainStatus = {
            "0": "Paused",
            "1": "Not Checked Yet",
            "2": "Up",
            "8": "Seems Down",
            "9": "Down",
        },
        statusFlag = {
            "Up": "green",
            "Down": "yellow",
            "Seems Down": "orange",
            "Paused": "black",
            "Not Checked Yet": "black"
        },
        lastName = ["l1", "l7", "l30"],

        ctx = document.getElementById("myChart"),
        $table = document.getElementById("domainList"),
        $overallUptime = document.getElementById("overallUptime"),
        $overallUptimeValue = $overallUptime.getElementsByClassName("value"),
        $overallUptimeDown = $overallUptime.getElementsByClassName("down"),
        $downTime = document.getElementById("downtime"),
        html = '';
    res = res.psp;
    for (const item of res.monitors) {
        html += '<tr><td><span class="ui ' + statusFlag[domainStatus[item.status]] + ' empty circular label"></span> ' +
            domainStatus[item.status] + '</td><td>' + item.oneWeekRange.ratio + '%</td><td class="selectable"><a href="https://' + item.friendly_name + '" target="_blank">'+ item.friendly_name + '</a></td><tr>';
    }
    $table.innerHTML = html;
    var data = {
        datasets: [{
            data: [res.pspStats.counts.up, res.pspStats.counts.down, res.pspStats.counts.pasued],
            backgroundColor: [
                '#448aff',
                '#f44336',
                'yellow'
            ]
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Up',
            'Down',
            'Paused'
        ]
    };
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            legend: {
                display: false,
            }
        }
    });
    lastName.forEach((v, i) => {
        $overallUptimeValue[i].textContent = res.pspStats.ratios[v].ratio + '%';
        $overallUptimeDown[i].textContent = res.pspStats.downDurations[v] + " mins";
    })
    $downTime.textContent = res.latestDownTimeStr;
    setTimeout('getMonitorsByApi()', 61000);
    let $fresh = document.getElementById("fresh"),
        i = 60,
        label = setInterval(() => {
            if (i == 0) {
                clearInterval(label);
            }
            $fresh.textContent = i;
            i--;
        }, 1000);
}