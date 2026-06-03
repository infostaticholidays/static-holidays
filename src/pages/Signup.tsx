const { data, error } = await supabase.auth.signUp({
  email: email.trim(),
  password: password.trim(),
});

console.log("SIGNUP ERROR:", error);

if (error) {
  alert(error.message);
  return;
}
