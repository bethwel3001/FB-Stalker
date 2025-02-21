document.getElementById("fb-login").addEventListener("click", function() {
    window.location.href = "http://localhost:5000/auth/facebook";
});

document.getElementById("process-link").addEventListener("click", async function() {
    const fbProfileLink = document.getElementById("fb-link").value;
    
    if (!fbProfileLink) {
        alert("Please enter a Facebook profile link!");
        return;
    }

    const response = await fetch("http://localhost:5000/process-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fbProfileLink })
    });

    const data = await response.json();

    if (response.ok) {
        window.location.href = data.redirectUrl;
    } else {
        alert(data.message);
    }
});
