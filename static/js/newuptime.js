getMonitorsByApi("https://api.fjut.eu.org/getUptime.php?user=wKLkwH4ZG&type=0");

// By uptimerobot
function getMonitorsByApi(url = '', setGet = {}) {
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
        $fresh = document.getElementById("fresh");

    fetch(url, setGet).then(res => res.json()).then(res => {
        if (res.stat === 'ok') {
            var res = res.psp,
                ctx = document.getElementById("myChart"),
                $table = document.getElementById("tableBody"),
                $overallUptime = document.getElementById("overallUptime"),
                $overallUptimeValue = $overallUptime.getElementsByClassName("value"),
                $overallUptimeDown = $overallUptime.getElementsByClassName("down"),
                $downTime = document.getElementById("downtime"),
                html = '';

            for (const item of res.monitors) {
                html += '<tr><td><span class="ui ' + statusFlag[domainStatus[item.status]] + ' empty circular label"></span> ' +
                    domainStatus[item.status] + '</td><td>' + item.oneWeekRange.ratio + '%</td><td>' + item.friendly_name + '</td><tr>';
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

        }
        setTimeout('getMonitorsByApi("https://api.fjut.eu.org/getUptime.php?user=wKLkwH4ZG&type=0")', 61000);
        let i = 60,
            intervalid = setInterval(() => {
                if (i == 0) {
                    clearInterval(intervalid);
                }
                $fresh.textContent = i;
                i--;
            }, 1000);
    });
}