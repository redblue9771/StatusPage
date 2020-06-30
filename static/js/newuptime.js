getMonitorsByApi();

function getMonitorsByApi() {
  fetch("https://api.uptimerobot.com/v2/getMonitors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: "ur569559-000946232f7a2cb0ea09c63f",
      timezone: "1",
      logs: "1",
      log_types: "1",
      custom_uptime_ratios: "1-7-30-45",
    }),
  })
    .then((res) => {
      if (res.ok && res.status === 200) {
        return res.json();
      } else {
        $fresh.textContent = "-";
        return {};
      }
    })
    .then((res) => {
      // console.log(res);
      if (res.stat === "ok") {
        console.log(res);
        renderHTML(res);
      }
    })
    .catch(console.log);
}

function renderHTML(res = {}) {
  const statusClass = (idx) =>
      (idx === 0 && "black") ||
      (idx === 1 && "black") ||
      (idx === 2 && "green") ||
      (idx === 8 && "orange") ||
      (idx === 9 && "yellow") ||
      "",
    statusStr = (idx) =>
      (idx === 0 && "Paused") ||
      (idx === 1 && "Not checked yet") ||
      (idx === 2 && "Up") ||
      (idx === 8 && "Seems down") ||
      (idx === 9 && "Down") ||
      "",
    lastName = ["l1", "l7", "l30"],
    ctx = document.getElementById("myChart"),
    $table = document.getElementById("domainList"),
    $overallUptime = document.getElementById("overallUptime"),
    $overallUptimeValue = $overallUptime.getElementsByClassName("value"),
    $overallUptimeDown = $overallUptime.getElementsByClassName("down"),
    $downTime = document.getElementById("downtime"),
    allRatios = [0, 0, 0, 0],
    statusCount = [0, 0, 0, 0, 0];
  let html = "";
  console.log(statusClass(1));
  for (const item of res.monitors) {
    switch (item.status) {
      case 0:
        statusCount[0]++;
        break;
      case 1:
        statusCount[1]++;
        break;
      case 2:
        statusCount[2]++;
        break;
      case 8:
        statusCount[3]++;
        break;
      case 9:
        statusCount[4]++;
        break;

      default:
        break;
    }

    const ratios = item.custom_uptime_ratio.split("-");
    allRatios[0] += Number(ratios[0]);
    allRatios[1] += Number(ratios[1]);
    allRatios[2] += Number(ratios[2]);
    allRatios[3] += Number(ratios[3]);
    html +=
      '<tr><td><span class="ui ' +
      statusClass(item.status) +
      ' empty circular label"></span> ' +
      statusStr(item.status) +
      '</td><td class="selectable"><a href="' +
      item.url +
      '" target="_blank">' +
      item.friendly_name +
      "</a></td><td>" +
      ratios[0] +
      "%</td><td>" +
      ratios[1] +
      "%</td><td>" +
      ratios[2] +
      "%</td><td>" +
      ratios[3] +
      "%</td><tr>";
  }
  $table.innerHTML = html;
  const data = {
    datasets: [
      {
        data: statusCount,
        backgroundColor: ["black", "black", "green", "orange", "yellow"],
      },
    ],
    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ["Paused", "Not checked yet", "Up", "Seems down", "Down"],
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

  allRatios.forEach((ratio, index) => {
    console.log(ratio, res.monitors.length);
    $overallUptimeValue[index].textContent = `${(
      ratio / res.monitors.length
    ).toFixed(3)}%`;
  });

  // $downTime.textContent = res.statistics.latest_downtime;
  // setTimeout("getMonitorsByApi()", 61000);
  // let $fresh = document.getElementById("fresh"),
  //   i = 60,
  //   label = setInterval(() => {
  //     if (i == 0) {
  //       clearInterval(label);
  //     }
  //     $fresh.textContent = i;
  //     i--;
  //   }, 1000);
}
