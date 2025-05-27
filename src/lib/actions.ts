"use server";

const handleSaveUser = async (formData: FormData) => {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const avatar = formData.get("avatar");
};
