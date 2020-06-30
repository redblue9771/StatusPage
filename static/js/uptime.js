getMonitorsByApi("https://api.uptimerobot.com/v2/getMonitors", {
  method: "POST",
  body: {
    api_key: "ur569559-000946232f7a2cb0ea09c63f",
    timezone: "1",
    logs: "1",
    log_types: "1",
    custom_uptime_ratios: "7",
  },
  // headers: {
  //     "Content-Type": "application/x-www-form-urlencoded"
  // },
  // body: "api_key=u569559-c0e7f28f93357de5cf044f57&format=json&logs=1&all_time_uptime_ratio=1&custom_uptime_ratios=1-7-30"
});
// By uptimerobot
function getMonitorsByApi(url = "", setGet = {}) {
  let domainStatus = {
      "0": "Paused",
      "1": "Not Checked Yet",
      "2": "Up",
      "8": "Seems Down",
      "9": "Down",
    },
    statusFlag = {
      Paused: "black",
      "Not Checked Yet": "black",

      Up: "green",

      "Seems Down": "orange",
      Down: "yellow",
    },
    statusCount = {
      "0": 0,
      "1": 0,
      "2": 0,
      "8": 0,
      "9": 0,
    };

  fetch(url, setGet)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.stat === "ok") {
        var res = res.monitors,
          len = res.length,
          ctx = document.getElementById("myChart"),
          $table = document.getElementById("tableBody"),
          $overallUptime = document.getElementsByClassName("upVal"),
          html = "",
          uptime = [],
          timeTotal = [0, 0, 0];

        for (const item of res) {
          uptime = item.custom_uptime_ratio.split("-");
          html +=
            '<tr><td><span class="ui ' +
            statusFlag[domainStatus[item.status]] +
            ' empty circular label"></span> ' +
            domainStatus[item.status] +
            "</td><td>" +
            uptime[0] +
            "%</td><td>" +
            item.friendly_name +
            '<a href="' +
            item.url +
            '" target="_blank"> ✈</i></a></td><tr>';
          statusCount[item.status]++;
          timeTotal[0] += Number(uptime[0]);
          timeTotal[1] += Number(uptime[1]);
          timeTotal[2] += Number(uptime[2]);
        }
        $table.innerHTML = html;
        var data = {
          datasets: [
            {
              data: [statusCount[2], statusCount[9], statusCount[0]],
              backgroundColor: ["#448aff", "#f44336", "yellow"],
            },
          ],
          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: ["Up", "Down", "Paused"],
        };
        new Chart(ctx, {
          type: "bar",
          data: data,
          options: {
            legend: {
              display: false,
            },
          },
        });
        let i = 0;
        for (const item of $overallUptime) {
          item.textContent =
            Math.round((timeTotal[i] / len) * 1000) / 1000 + "%";
          i++;
        }
      }
    });
}
