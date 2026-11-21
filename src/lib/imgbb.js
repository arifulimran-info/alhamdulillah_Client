// Uploads an image file straight to ImgBB and returns the hosted URL.
export async function uploadToImgBB(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("ImgBB key is missing (NEXT_PUBLIC_IMGBB_KEY)");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json?.error?.message || "Image upload failed");
  return json.data.display_url;
}
