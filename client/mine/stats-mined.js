setTimeout(() => {
    let bars = document.getElementsByClassName("30-days")[0].getElementsByClassName("bar")
    let date = new Date();
    let dscRepartition = [1, 3, 6, 3, 6, 2, 7, 4, 5, 0, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8, 6, 5, 6, 3, 1, 3, 6, 3, 6, 2, 7, 4, 5, 6, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8, 6, 5, 6, 3, 5, 6, 5, 7, 1, 3, 6, 3, 6, 2, 7, 4, 5, 6, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8]
    for (var i = 0; i < bars.length; i++) {
        date.setDate(date.getDate() - 1);
        let dsc = dscRepartition[i]
        console.log(date.getDate().toString() + "/" + date.getMonth().toString() + "<br>" + dsc.toString() + "DSC");
        bars.item(i).innerHTML = date.getDate().toString() + "/" + date.getMonth().toString() + "<br>" + dsc.toString() + "DSC"
        bars.item(i).style.height = (dsc * 10 + 10).toString() + "%";
        if (dsc > 5) {
            bars.item(i).classList.add("green")
        } else {
            bars.item(i).classList.add("red")
        }
    }
    bars = document.getElementsByClassName("24-hours")[0].getElementsByClassName("bar")
    date = new Date();
    dscRepartition = [1, 3, 6, 3, 6, 2, 7, 4, 5, 0, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4]
    for (var i = 0; i < bars.length; i++) {
        date.setHours(date.getHours() - 1);
        let dsc = dscRepartition[i]
        console.log(date.getHours().toString() + "H00 <br>" + dsc.toString() + "DSC");
        bars.item(i).innerHTML = date.getHours().toString() + "H00 <br>" + dsc.toString() + "DSC"
        bars.item(i).style.height = (dsc * 10 + 12).toString() + "%";
        if (dsc > 5) {
            bars.item(i).classList.add("green")
        } else {
            bars.item(i).classList.add("red")
        }
    }
    bars = document.getElementsByClassName("60-min")[0].getElementsByClassName("bar")
    date = new Date();
    dscRepartition = [1, 3, 6, 3, 6, 2, 7, 4, 5, 0, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8, 6, 5, 6, 3, 1, 3, 6, 3, 6, 2, 7, 4, 5, 6, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8, 6, 5, 6, 3, 5, 6, 5, 7, 1, 3, 6, 3, 6, 2, 7, 4, 5, 6, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8, 1, 3, 6, 3, 6, 2, 7, 4, 5, 0, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8, 6, 5, 6, 3, 1, 3, 6, 3, 6, 2, 7, 4, 5, 6, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8, 6, 5, 6, 3, 5, 6, 5, 7, 1, 3, 6, 3, 6, 2, 7, 4, 5, 6, 3, 5, 6, 2, 4, 3, 1, 4, 5, 3, 4, 5, 7, 4, 2, 7, 8]
    for (var i = 0; i < bars.length; i++) {
        date.setMinutes(date.getMinutes() - 1);
        let dsc = dscRepartition[i]
        console.log(date.getHours().toString() + "/" + date.getMinutes().toString() + "<br>" + dsc.toString() + "DSC");
        bars.item(i).innerHTML = date.getHours().toString() + "/" + date.getMinutes().toString() + "<br>" + dsc.toString() + "DSC"
        bars.item(i).style.height = (dsc * 10 + 6).toString() + "%";
        if (dsc > 5) {
            bars.item(i).classList.add("green")
        } else {
            bars.item(i).classList.add("red")
        }
    }
    document.getElementById("last-month").addEventListener("click", () => switchGraph(0))
    document.getElementById("last-24h").addEventListener("click", () => switchGraph(1))
    document.getElementById("last-hour").addEventListener("click", () => switchGraph(2))
    function switchGraph(i) {
        console.log("switchgraphs");
        document.getElementById("month").classList.remove("active")
        document.getElementById("24h").classList.remove("active")
        document.getElementById("hour").classList.remove("active")
        if (i === 0) {
            document.getElementById("month").classList.add("active")
        } else if (i === 1) {
            document.getElementById("24h").classList.add("active")
        } else if (i === 2) {
            document.getElementById("hour").classList.add("active")
        }
        document.getElementById("last-month").classList.remove("active")
        document.getElementById("last-24h").classList.remove("active")
        document.getElementById("last-hour").classList.remove("active")
        if (i === 0) {
            document.getElementById("last-month").classList.add("active")
        } else if (i === 1) {
            document.getElementById("last-24h").classList.add("active")
        } else if (i === 2) {
            document.getElementById("last-hour").classList.add("active")
        }
    }
}, 1200);