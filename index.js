const http = require("http");

let sensorData = {
    device_id: "ESP32-SMART-HOME",
    suhu: 0,
    kelembaban: 0,
    kadar_gas: 0,
    jarak: 0,
    status_bahaya: false,
    created_at: null
};

let history = [];

// ==========================================
// JSON RESPONSE
// ==========================================

function sendJSON(res, status, data) {

    res.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
    });

    res.end(JSON.stringify(data));
}


// ==========================================
// DASHBOARD
// ==========================================

function dashboard() {

    return `<!DOCTYPE html>

<html lang="id">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>Smart Home Dashboard</title>


<!-- Tailwind CSS -->

<script src="https://cdn.tailwindcss.com"></script>


<!-- Lucide Icons -->

<script src="https://unpkg.com/lucide@latest"></script>


<!-- Chart.js -->

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


<script>

tailwind.config = {

    theme: {

        extend: {

            colors: {

                darkbg: "#020617"

            }

        }

    }

};

</script>


<style>

body {

    background:
        radial-gradient(
            circle at top,
            #172554 0%,
            #020617 45%
        );

}


.glass {

    background:
        rgba(15, 23, 42, 0.75);

    backdrop-filter:
        blur(12px);

}


.card-hover {

    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;

}


.card-hover:hover {

    transform:
        translateY(-3px);

    border-color:
        rgba(148, 163, 184, 0.35);

    box-shadow:
        0 15px 35px rgba(0,0,0,0.25);

}


.icon-box {

    width: 48px;

    height: 48px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 14px;

}


</style>

</head>


<body class="text-white min-h-screen">


<!-- ======================================
     HEADER
====================================== -->

<header
    class="
        border-b
        border-slate-800/80
        bg-slate-950/70
        backdrop-blur-xl
        sticky
        top-0
        z-50
    "
>

    <div
        class="
            max-w-7xl
            mx-auto
            px-4
            py-4
            flex
            items-center
            justify-between
        "
    >

        <div class="flex items-center gap-3">

            <div
                class="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-500/15
                    border
                    border-blue-500/30
                    flex
                    items-center
                    justify-center
                "
            >

                <i
                    data-lucide="house"
                    class="w-6 h-6 text-blue-400"
                ></i>

            </div>


            <div>

                <h1
                    class="
                        text-xl
                        md:text-2xl
                        font-bold
                    "
                >
                    Smart Home
                </h1>

                <p
                    class="
                        text-xs
                        md:text-sm
                        text-slate-400
                    "
                >
                    ESP32 Monitoring Dashboard
                </p>

            </div>

        </div>


        <div
            class="
                flex
                items-center
                gap-2
                text-sm
            "
        >

            <span
                id="connectionDot"
                class="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-emerald-400
                "
            ></span>

            <span
                id="connectionText"
                class="text-slate-400 hidden sm:block"
            >
                Online
            </span>

        </div>

    </div>

</header>


<!-- ======================================
     MAIN
====================================== -->

<main
    class="
        max-w-7xl
        mx-auto
        px-4
        py-6
    "
>


<!-- ======================================
     STATUS
====================================== -->

<div
    id="status"
    class="
        glass
        mb-6
        p-5
        rounded-2xl
        border
        border-emerald-500/30
    "
>

    <div
        class="
            flex
            items-center
            gap-4
        "
    >

        <div
            id="statusIcon"
            class="
                icon-box
                bg-emerald-500/10
            "
        >

            <i
                data-lucide="shield-check"
                class="w-7 h-7 text-emerald-400"
            ></i>

        </div>


        <div>

            <h2
                id="statusTitle"
                class="
                    text-xl
                    font-bold
                    text-emerald-400
                "
            >
                SISTEM AMAN
            </h2>

            <p
                id="statusDescription"
                class="
                    text-sm
                    text-slate-400
                    mt-1
                "
            >
                Tidak ada kondisi bahaya.
            </p>

        </div>

    </div>

</div>


<!-- ======================================
     SENSOR CARDS
====================================== -->

<div
    class="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
    "
>


<!-- SUHU -->

<div
    class="
        glass
        border
        border-slate-800
        rounded-2xl
        p-5
        card-hover
    "
>

    <div
        class="
            flex
            justify-between
            items-start
        "
    >

        <div>

            <p class="text-slate-400 text-sm">
                Suhu
            </p>

            <p
                class="
                    text-3xl
                    font-bold
                    mt-2
                "
            >

                <span id="suhu">
                    0
                </span>

                <span
                    class="
                        text-base
                        text-slate-400
                    "
                >
                    °C
                </span>

            </p>

        </div>


        <div
            class="
                icon-box
                bg-orange-500/10
            "
        >

            <i
                data-lucide="thermometer"
                class="
                    w-6
                    h-6
                    text-orange-400
                "
            ></i>

        </div>

    </div>

</div>


<!-- KELEMBAPAN -->

<div
    class="
        glass
        border
        border-slate-800
        rounded-2xl
        p-5
        card-hover
    "
>

    <div
        class="
            flex
            justify-between
            items-start
        "
    >

        <div>

            <p class="text-slate-400 text-sm">
                Kelembapan
            </p>

            <p
                class="
                    text-3xl
                    font-bold
                    mt-2
                "
            >

                <span id="kelembaban">
                    0
                </span>

                <span
                    class="
                        text-base
                        text-slate-400
                    "
                >
                    %
                </span>

            </p>

        </div>


        <div
            class="
                icon-box
                bg-cyan-500/10
            "
        >

            <i
                data-lucide="droplets"
                class="
                    w-6
                    h-6
                    text-cyan-400
                "
            ></i>

        </div>

    </div>

</div>


<!-- GAS -->

<div
    class="
        glass
        border
        border-slate-800
        rounded-2xl
        p-5
        card-hover
    "
>

    <div
        class="
            flex
            justify-between
            items-start
        "
    >

        <div>

            <p class="text-slate-400 text-sm">
                Kadar Gas
            </p>

            <p
                id="gas"
                class="
                    text-3xl
                    font-bold
                    mt-2
                "
            >
                0
            </p>

        </div>


        <div
            class="
                icon-box
                bg-purple-500/10
            "
        >

            <i
                data-lucide="wind"
                class="
                    w-6
                    h-6
                    text-purple-400
                "
            ></i>

        </div>

    </div>

</div>


<!-- JARAK -->

<div
    class="
        glass
        border
        border-slate-800
        rounded-2xl
        p-5
        card-hover
    "
>

    <div
        class="
            flex
            justify-between
            items-start
        "
    >

        <div>

            <p class="text-slate-400 text-sm">
                Jarak
            </p>

            <p
                class="
                    text-3xl
                    font-bold
                    mt-2
                "
            >

                <span id="jarak">
                    0
                </span>

                <span
                    class="
                        text-base
                        text-slate-400
                    "
                >
                    cm
                </span>

            </p>

        </div>


        <div
            class="
                icon-box
                bg-blue-500/10
            "
        >

            <i
                data-lucide="scan-line"
                class="
                    w-6
                    h-6
                    text-blue-400
                "
            ></i>

        </div>

    </div>

</div>


</div>


<!-- ======================================
     CHARTS
====================================== -->

<div
    class="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        mt-6
    "
>


<!-- SUHU -->

<div
    class="
        glass
        border
        border-slate-800
        rounded-2xl
        p-5
    "
>

    <div
        class="
            flex
            items-center
            gap-3
            mb-5
        "
    >

        <div
            class="
                icon-box
                bg-orange-500/10
            "
        >

            <i
                data-lucide="chart-line"
                class="
                    w-6
                    h-6
                    text-orange-400
                "
            ></i>

        </div>


        <div>

            <h2 class="font-bold text-lg">
                Traffic Suhu
            </h2>

            <p class="text-sm text-slate-400">
                Riwayat suhu
            </p>

        </div>

    </div>


    <div class="h-72">

        <canvas id="suhuChart"></canvas>

    </div>

</div>


<!-- KELEMBAPAN -->

<div
    class="
        glass
        border
        border-slate-800
        rounded-2xl
        p-5
    "
>

    <div
        class="
            flex
            items-center
            gap-3
            mb-5
        "
    >

        <div
            class="
                icon-box
                bg-cyan-500/10
            "
        >

            <i
                data-lucide="chart-line"
                class="
                    w-6
                    h-6
                    text-cyan-400
                "
            ></i>

        </div>


        <div>

            <h2 class="font-bold text-lg">
                Traffic Kelembapan
            </h2>

            <p class="text-sm text-slate-400">
                Riwayat kelembapan
            </p>

        </div>

    </div>


    <div class="h-72">

        <canvas id="kelembabanChart"></canvas>

    </div>

</div>


</div>


<!-- ======================================
     INFO DEVICE
====================================== -->

<div
    class="
        glass
        border
        border-slate-800
        rounded-2xl
        p-5
        mt-6
    "
>

    <div
        class="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
        "
    >

        <div
            class="
                flex
                items-center
                gap-3
            "
        >

            <div
                class="
                    icon-box
                    bg-blue-500/10
                "
            >

                <i
                    data-lucide="cpu"
                    class="
                        w-6
                        h-6
                        text-blue-400
                    "
                ></i>

            </div>


            <div>

                <p class="text-sm text-slate-400">
                    Device
                </p>

                <p
                    id="device"
                    class="font-semibold"
                >
                    ESP32-SMART-HOME
                </p>

            </div>

        </div>


        <div
            class="
                flex
                items-center
                gap-3
            "
        >

            <div
                class="
                    icon-box
                    bg-slate-800
                "
            >

                <i
                    data-lucide="clock-3"
                    class="
                        w-5
                        h-5
                        text-slate-300
                    "
                ></i>

            </div>


            <div>

                <p class="text-sm text-slate-400">
                    Update terakhir
                </p>

                <p
                    id="lastUpdate"
                    class="font-semibold"
                >
                    -
                </p>

            </div>

        </div>

    </div>

</div>


<!-- FOOTER -->

<footer
    class="
        text-center
        text-slate-500
        text-sm
        py-8
    "
>

    <div
        class="
            flex
            items-center
            justify-center
            gap-2
        "
    >

        <i
            data-lucide="wifi"
            class="w-4 h-4"
        ></i>

        ESP32 Smart Home

    </div>

</footer>


</main>


<script>

// ==========================================
// LUCIDE ICONS
// ==========================================

lucide.createIcons();


// ==========================================
// CHART VARIABLES
// ==========================================

let suhuChart;

let kelembabanChart;


// ==========================================
// CREATE CHART
// ==========================================

function createCharts() {


    suhuChart = new Chart(

        document.getElementById("suhuChart"),

        {

            type: "line",

            data: {

                labels: [],

                datasets: [{

                    label: "Suhu °C",

                    data: [],

                    borderWidth: 2,

                    tension: 0.35,

                    fill: true

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                interaction: {

                    intersect: false,

                    mode: "index"

                },

                scales: {

                    y: {

                        grid: {

                            color:
                                "rgba(148,163,184,0.10)"

                        }

                    },

                    x: {

                        grid: {

                            color:
                                "rgba(148,163,184,0.05)"

                        }

                    }

                }

            }

        }

    );


    kelembabanChart = new Chart(

        document.getElementById(
            "kelembabanChart"
        ),

        {

            type: "line",

            data: {

                labels: [],

                datasets: [{

                    label: "Kelembapan %",

                    data: [],

                    borderWidth: 2,

                    tension: 0.35,

                    fill: true

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                interaction: {

                    intersect: false,

                    mode: "index"

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        grid: {

                            color:
                                "rgba(148,163,184,0.10)"

                        }

                    },

                    x: {

                        grid: {

                            color:
                                "rgba(148,163,184,0.05)"

                        }

                    }

                }

            }

        }

    );

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

async function updateDashboard() {

    try {

        const response =
            await fetch(
                "/api/data",
                {
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        const data =
            result.latest;


        // ------------------------------
        // SENSOR
        // ------------------------------

        document.getElementById("suhu")
            .textContent =
            Number(data.suhu || 0)
                .toFixed(1);


        document.getElementById("kelembaban")
            .textContent =
            Number(data.kelembaban || 0)
                .toFixed(1);


        document.getElementById("gas")
            .textContent =
            data.kadar_gas ?? 0;


        document.getElementById("jarak")
            .textContent =
            Number(data.jarak || 0)
                .toFixed(1);


        document.getElementById("device")
            .textContent =
            data.device_id ||
            "ESP32-SMART-HOME";


        // ------------------------------
        // WAKTU
        // ------------------------------

        if (data.created_at) {

            document.getElementById(
                "lastUpdate"
            ).textContent =
                new Date(
                    data.created_at
                ).toLocaleTimeString(
                    "id-ID"
                );

        }


        // ------------------------------
        // STATUS
        // ------------------------------

        const status =
            document.getElementById(
                "status"
            );

        const statusIcon =
            document.getElementById(
                "statusIcon"
            );

        const statusTitle =
            document.getElementById(
                "statusTitle"
            );

        const statusDescription =
            document.getElementById(
                "statusDescription"
            );


        if (data.status_bahaya) {

            status.className =
                "glass mb-6 p-5 rounded-2xl " +
                "border border-red-500/40";


            statusIcon.className =
                "icon-box bg-red-500/10";


statusIcon.innerHTML =
    '<i data-lucide="triangle-alert" class="w-7 h-7 text-red-400"></i>';


            statusTitle.className =
                "text-xl font-bold text-red-400";


            statusTitle.textContent =
                "STATUS BAHAYA";


            statusDescription.textContent =
                "Sensor mendeteksi kondisi melewati batas.";

        }

        else {

            status.className =
                "glass mb-6 p-5 rounded-2xl " +
                "border border-emerald-500/30";


            statusIcon.className =
                "icon-box bg-emerald-500/10";


statusIcon.innerHTML =
    '<i data-lucide="shield-check" class="w-7 h-7 text-emerald-400"></i>';


            statusTitle.className =
                "text-xl font-bold text-emerald-400";


            statusTitle.textContent =
                "SISTEM AMAN";


            statusDescription.textContent =
                "Tidak ada kondisi bahaya.";

        }


        lucide.createIcons();


        // ------------------------------
        // ONLINE
        // ------------------------------

        document.getElementById(
            "connectionDot"
        ).className =
            "w-2.5 h-2.5 rounded-full " +
            "bg-emerald-400";


        document.getElementById(
            "connectionText"
        ).textContent =
            "Online";


        // ------------------------------
        // CHART
        // ------------------------------

        const labels =
            result.history.map(
                item => item.time
            );


        const suhu =
            result.history.map(
                item => item.suhu
            );


        const kelembaban =
            result.history.map(
                item => item.kelembaban
            );


        suhuChart.data.labels =
            labels;

        suhuChart.data.datasets[0].data =
            suhu;

        suhuChart.update();


        kelembabanChart.data.labels =
            labels;

        kelembabanChart.data.datasets[0].data =
            kelembaban;

        kelembabanChart.update();


    }

    catch (error) {

        console.error(error);


        document.getElementById(
            "connectionDot"
        ).className =
            "w-2.5 h-2.5 rounded-full bg-red-500";


        document.getElementById(
            "connectionText"
        ).textContent =
            "Offline";

    }

}


// ==========================================
// START
// ==========================================

createCharts();

updateDashboard();


// Update setiap 1 detik

setInterval(
    updateDashboard,
    500
);

</script>


</body>

</html>`;
}


// ==========================================
// SERVER
// ==========================================

async function handler(req, res) {

    const url =
        new URL(
            req.url,
            `http://${req.headers.host}`
        );


    // ======================================
    // GET DATA
    // ======================================

    if (
        url.pathname === "/api/data" &&
        req.method === "GET"
    ) {

        return sendJSON(
            res,
            200,
            {
                latest: sensorData,
                history: history
            }
        );

    }


    // ======================================
    // ESP32 SEND DATA
    // ======================================

    if (
        url.pathname === "/api/sensor" &&
        req.method === "POST"
    ) {

        let body = "";


        req.on(
            "data",
            chunk => {

                body += chunk;

            }
        );


        req.on(
            "end",
            () => {

                try {

                    const data =
                        JSON.parse(body);


                    sensorData = {

                        device_id:
                            data.device_id ||
                            "ESP32-SMART-HOME",

                        suhu:
                            Number(
                                data.suhu || 0
                            ),

                        kelembaban:
                            Number(
                                data.kelembaban || 0
                            ),

                        kadar_gas:
                            Number(
                                data.kadar_gas || 0
                            ),

                        jarak:
                            Number(
                                data.jarak || 0
                            ),

                        status_bahaya:
                            Boolean(
                                data.status_bahaya
                            ),

                        created_at:
                            new Date()
                                .toISOString()

                    };


                    // Simpan histori

                    history.push({

                        time:
                            new Date()
                                .toLocaleTimeString(
                                    "id-ID"
                                ),

                        suhu:
                            sensorData.suhu,

                        kelembaban:
                            sensorData.kelembaban

                    });


                    // Maksimal 50 data

                    if (
                        history.length > 50
                    ) {

                        history.shift();

                    }


                    return sendJSON(
                        res,
                        200,
                        {
                            success: true,
                            data: sensorData
                        }
                    );


                }

                catch (error) {

                    return sendJSON(
                        res,
                        400,
                        {
                            success: false,
                            error:
                                "JSON tidak valid"
                        }
                    );

                }

            }
        );


        return;

    }


    // ======================================
    // DASHBOARD
    // ======================================

    if (
        url.pathname === "/" &&
        req.method === "GET"
    ) {

        res.writeHead(
            200,
            {
                "Content-Type":
                    "text/html; charset=utf-8",

                "Cache-Control":
                    "no-store"
            }
        );


        res.end(
            dashboard()
        );


        return;

    }


    // ======================================
    // 404
    // ======================================

    sendJSON(
        res,
        404,
        {
            error: "Not Found"
        }
    );

}


// ==========================================
// EXPORT VERCEL
// ==========================================

module.exports = handler;


// ==========================================
// LOCAL SERVER
// ==========================================

if (require.main === module) {

    const PORT =
        process.env.PORT || 3000;


    const server =
        http.createServer(handler);


    server.listen(
        PORT,
        () => {

            console.log(
                `Smart Home berjalan di http://localhost:${PORT}`
            );

        }
    );

}