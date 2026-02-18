async function testLogin() {
  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/admin-login-step1",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "shivampatel2330@gmail.com",
          password: "mike@1714",
        }),
      },
    );

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testLogin();
