const { data, error } = await supabase.auth.signUp({
  email: email.trim(),
  password: password.trim(),
});

console.log("SIGNUP ERROR FULL:", error);
console.log("SIGNUP DATA:", data);

if (error) {
  alert(error.message);
  return;
}
