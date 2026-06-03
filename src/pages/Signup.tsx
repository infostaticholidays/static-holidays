const { data, error } = await supabase.auth.signUp({
  email: cleanEmail,
  password: cleanPassword,
});

console.log("DATA:", data);
console.log("ERROR:", error);

if (error) {
  alert(JSON.stringify(error, null, 2));
  return;
}
