async function handleSignup() {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    alert("Please fill all fields");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: cleanPassword,
  });

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  alert("Account created! Check your email (or go to login).");
  navigate("/login");
}
