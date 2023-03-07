const defaultSettings = ["Replace with IP public adress", "2811", "true", "true", "false", "60"]
let settings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : defaultSettings;

for (let i = 0; i < settings.length; i++) {
    document.getElementById("setting" + (i + 1).toString()).value = settings[i]
}

function save() {
    for (let i = 0; i < settings.length; i++) {
        console.log(settings[i]);
        console.log(document.getElementById("setting" + (i + 1).toString()).value);
        try {
            if (document.getElementById("setting" + (i + 1).toString()).value && document.getElementById("setting" + (i + 1).toString()).value != "") settings[i] = document.getElementById("setting" + (i + 1).toString()).value
        } catch (err) {
            console.log(err);
        }
        console.log("=>");
        console.log(settings[i]);
    }
    console.log("saved:");
    console.log(settings);
    localStorage.setItem('settings', JSON.stringify(settings));
}