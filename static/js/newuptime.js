getMonitorsByApi();

function getMonitorsByApi() {
    // fetch("https://api.fjut.eu.org/getUptime.php?user=wKLkwH4ZG&type=0").then(res => {
    //     if (res.ok) {
    //         return res.json();
    //     } else {
    //         fetch("https://fjutwzk.heliohost.org/api/getUptime.php?user=wKLkwH4ZG&type=0").then(res1 => {
    //             if (res1.ok) {
    //                 return res.json();
    //             } else {
    //                 alert("Data acquisition failed, please refresh and try again!");
    //                 $fresh.textContent = "-";
    //             }
    //         }).then(res1 => {
    //             if (res1.stat === "ok") {
    //                 renderHTML(res1);
    //             }
    //         });
    //     }
    // }).then(res => {
    //     if (res.stat === "ok") {
    //         renderHTML(res);
    //     }
    // });
    fetch("https://api.fjut.eu.org/getUptime.php?user=wKLkwH4ZG&type=3").then(res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Data acquisition failed, please refresh and try again!");
            $fresh.textContent = "-";
        }
    }).then(res => {
        renderHTML(res);
    });
}

function renderHTML(res = {}) {
    let statusFlag = {
            "success": "green",
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
    for (const item of res.psp.monitors) {
        html += '<tr><td><span class="ui ' + statusFlag[item.statusClass] + ' empty circular label"></span> ' +
            item.statusClass + '</td><td>' + item.weeklyRatio.ratio + '%</td><td class="selectable"><a href="https://' + item.name + '" target="_blank">' + item.name + '</a></td><tr>';
    }
    $table.innerHTML = html;
    var data = {
        datasets: [{
            data: [res.statistics.counts.up, res.statistics.counts.down, res.statistics.counts.pasued],
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

    {
        let i = 0;
        for (const key in res.statistics.uptime) {
            if (res.statistics.uptime.hasOwnProperty(key)) {
                const element = res.statistics.uptime[key];
                $overallUptimeValue[i].textContent = element.ratio + '%';
                $overallUptimeDown[i].textContent = element.downtime;
                i++;
            }
        }
    }


    $downTime.textContent = res.statistics.latest_downtime;
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