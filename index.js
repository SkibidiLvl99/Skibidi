```javascript
// =========================================================
// ESP32 SMART HOME - VERCEL
// =========================================================

// Status sementara di memory server
let sensorData = {
    device_id: "ESP32-SMART-HOME",
    suhu: 0,
    kelembaban: 0,
    lampu: 0,
    updated_at: null
};

let lightCommand = 0;


// =========================================================
// HTML DASHBOARD
// =========================================================

const html = `
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>ESP32 Smart Home</title>

    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #0f172a;
        }

        .card {
            background: #1e293b;
            border: 1px solid #334155;
        }

        .btn {
            transition: 0.15s;
        }

        .btn:active {
            transform: scale(0.96);
        }
    </style>
</head>

<body class="text-white min-h-screen">

    <div class="max-w-5xl mx-auto p-5">

        <!-- HEADER -->

        <div class="mb-6">

            <h1 class="text-3xl font-bold">
                ESP32 Smart Home
            </h1>

            <p class="text-slate-400 mt-1">
                Monitoring & kontrol rumah pintar
            </p>

        </div>


        <!-- STATUS DEVICE -->

        <div class="card rounded-2xl p-5 mb-5">

            <div class="flex items-center justify-between">

                <div>

                    <p class="text-sm text-slate-400">
                        Status ESP32
                    </p>

                    <p id="deviceStatus"
                       class="text-xl font-bold text-red-400">
                        Menunggu data...
                    </p>

                </div>

                <div
                    id="statusDot"
                    class="w-4 h-4 rounded-full bg-red-500">
                </div>

            </div>

        </div>


        <!-- SENSOR -->

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            <!-- SUHU -->

            <div class="card rounded-2xl p-6">

                <p class="text-slate-400 text-sm">
                    Suhu
                </p>

                <div class="mt-3 flex items-end gap-2">

                    <span
                        id="temperature"
                        class="text-5xl font-bold">
                        --</span>

                    <span class="text-slate-400 mb-2">
                        °C
                    </span>

                </div>

            </div>


            <!-- KELEMBABAN -->

            <div class="card rounded-2xl p-6">

                <p class="text-slate-400 text-sm">
                    Kelembapan
                </p>

                <div class="mt-3 flex items-end gap-2">

                    <span
                        id="humidity"
                        class="text-5xl font-bold">
                        --</span>

                    <span class="text-slate-400 mb-2">
                        %
                    </span>

                </div>

            </div>

        </div>


        <!-- KONTROL LAMPU -->

        <div class="card rounded-2xl p-6">

            <div class="flex items-center justify-between mb-5">

                <div>

                    <p class="text-sm text-slate-400">
                        Kontrol Lampu
                    </p>

                    <h2
                        id="lampStatus"
                        class="text-2xl font-bold mt-1">
                        OFF
                    </h2>

                </div>

                <div
                    id="lampIndicator"
                    class="w-12 h-12 rounded-full bg-slate-700">
                </div>

            </div>


            <div class="grid grid-cols-2 gap-4">

                <button
                    id="onButton"
                    onclick="setLamp(1)"
                    class="btn bg-green-600 hover:bg-green-500
                           rounded-xl py-4 font-bold text-lg">

                    NYALAKAN

                </button>


                <button
                    id="offButton"
                    onclick="setLamp(0)"
                    class="btn bg-red-600 hover:bg-red-500
                           rounded-xl py-4 font-bold text-lg">

                    MATIKAN

                </button>

            </div>


            <p
                id="commandStatus"
                class="text-sm text-slate-400 mt-4 text-center">
                Siap menerima perintah
            </p>

        </div>


        <!-- UPDATE -->

        <div class="text-center mt-5">

            <p
                id="lastUpdate"
                class="text-xs text-slate-500">
                Belum ada data
            </p>

        </div>

    </div>


<script>

// =========================================================
// UPDATE DASHBOARD
// =========================================================

async function updateDashboard() {

    try {

        const response = await fetch("/api/status");

        if (!response.ok) {
            throw new Error("Gagal mengambil status");
        }

        const data = await response.json();


        // SENSOR

        document.getElementById("temperature").textContent =
            data.suhu ?? "--";

        document.getElementById("humidity").textContent =
            data.kelembaban ?? "--";


        // LAMPU

        updateLampUI(data.lampu);


        // DEVICE STATUS

        const status = document.getElementById("deviceStatus");
        const dot = document.getElementById("statusDot");

        if (data.updated_at) {

            const updateTime =
                new Date(data.updated_at).getTime();

            const sekarang =
                Date.now();

            const selisih =
                sekarang - updateTime;


            if (selisih < 5000) {

                status.textContent = "ONLINE";
                status.className =
                    "text-xl font-bold text-green-400";

                dot.className =
                    "w-4 h-4 rounded-full bg-green-500";

            } else {

                status.textContent = "OFFLINE";
                status.className =
                    "text-xl font-bold text-red-400";

                dot.className =
                    "w-4 h-4 rounded-full bg-red-500";
            }

        } else {

            status.textContent = "MENUNGGU ESP32";
            status.className =
                "text-xl font-bold text-yellow-400";

            dot.className =
                "w-4 h-4 rounded-full bg-yellow-500";
        }


        // WAKTU

        if (data.updated_at) {

            document.getElementById("lastUpdate").textContent =
                "Update: " +
                new Date(data.updated_at).toLocaleTimeString(
                    "id-ID"
                );

        }

    } catch (error) {

        console.log(error);

    }

}


// =========================================================
// UPDATE UI LAMPU
// =========================================================

function updateLampUI(status) {

    const lampStatus =
        document.getElementById("lampStatus");

    const indicator =
        document.getElementById("lampIndicator");


    if (status === 1 || status === true) {

        lampStatus.textContent = "ON";

        lampStatus.className =
            "text-2xl font-bold mt-1 text-green-400";

        indicator.className =
            "w-12 h-12 rounded-full bg-yellow-400";

    } else {

        lampStatus.textContent = "OFF";

        lampStatus.className =
            "text-2xl font-bold mt-1 text-slate-300";

        indicator.className =
            "w-12 h-12 rounded-full bg-slate-700";
    }

}


// =========================================================
// KONTROL LAMPU
// =========================================================

async function setLamp(value) {

    const commandStatus =
        document.getElementById("commandStatus");


    commandStatus.textContent =
        value === 1
            ? "Mengirim perintah ON..."
            : "Mengirim perintah OFF...";


    try {

        const response = await fetch(
            "/api/light",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    device_id: "ESP32-SMART-HOME",
                    lampu: value
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Gagal mengirim perintah"
            );

        }


        commandStatus.textContent =
            value === 1
                ? "Perintah ON terkirim"
                : "Perintah OFF terkirim";


        updateLampUI(value);

    } catch (error) {

        commandStatus.textContent =
            "Gagal: " + error.message;

    }

}


// =========================================================
// POLLING DASHBOARD
// =========================================================

// Update setiap 500 ms

setInterval(
    updateDashboard,
    500
);


// Jalankan langsung

updateDashboard();

</script>

</body>
</html>
`;


// =========================================================
// VERCEL HANDLER
// =========================================================

export default async function handler(req, res) {

    const url = new URL(
        req.url,
        `https://${req.headers.host}`
    );

    const pathname = url.pathname;


    // =====================================================
    // DASHBOARD
    // =====================================================

    if (
        pathname === "/" ||
        pathname === "/index.html"
    ) {

        res.setHeader(
            "Content-Type",
            "text/html; charset=utf-8"
        );

        return res.status(200).send(html);
    }


    // =====================================================
    // ESP32 -> VERCEL
    // POST /api/sensor
    // =====================================================

    if (
        pathname === "/api/sensor" &&
        req.method === "POST"
    ) {

        try {

            let body = req.body;


            if (
                typeof body === "string"
            ) {

                body = JSON.parse(body);

            }


            sensorData = {

                device_id:
                    body.device_id ||
                    "ESP32-SMART-HOME",

                suhu:
                    Number(body.suhu) || 0,

                kelembaban:
                    Number(body.kelembaban) || 0,

                lampu:
                    body.lampu ? 1 : 0,

                updated_at:
                    new Date().toISOString()

            };


            return res.status(200).json({

                success: true,

                message: "Data sensor diterima",

                data: sensorData

            });

        } catch (error) {

            return res.status(400).json({

                success: false,

                error: "JSON tidak valid"

            });

        }

    }


    // =====================================================
    // DASHBOARD -> STATUS
    // GET /api/status
    // =====================================================

    if (
        pathname === "/api/status" &&
        req.method === "GET"
    ) {

        return res.status(200).json({

            ...sensorData,

            lampu: lightCommand

        });

    }


    // =====================================================
    // DASHBOARD -> VERCEL
    // POST /api/light
    // =====================================================

    if (
        pathname === "/api/light" &&
        req.method === "POST"
    ) {

        try {

            let body = req.body;


            if (
                typeof body === "string"
            ) {

                body = JSON.parse(body);

            }


            const value =
                body.lampu === true ||
                body.lampu === 1 ||
                body.lampu === "1"
                    ? 1
                    : 0;


            lightCommand = value;


            sensorData.lampu = value;


            return res.status(200).json({

                success: true,

                lampu: value,

                message:
                    value === 1
                        ? "Lampu diperintahkan ON"
                        : "Lampu diperintahkan OFF"

            });

        } catch (error) {

            return res.status(400).json({

                success: false,

                error: "Perintah tidak valid"

            });

        }

    }


    // =====================================================
    // ESP32 -> VERCEL
    // GET /api/command
    // =====================================================

    if (
        pathname === "/api/command" &&
        req.method === "GET"
    ) {

        return res.status(200).json({

            device_id:
                url.searchParams.get("device_id") ||
                "ESP32-SMART-HOME",

            lampu: lightCommand

        });

    }


    // =====================================================
    // 404
    // =====================================================

    return res.status(404).json({

        success: false,

        error: "Endpoint tidak ditemukan"

    });

}
```
