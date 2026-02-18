async function testAccess() {
  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/super-admin-access",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "DESIGNHUNT12" }),
      },
    );

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testAccess();
