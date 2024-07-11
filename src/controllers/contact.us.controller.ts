import catchAsyncError from "../middlewares/catchAsyncErrors";
import sendMessage from "../utils/sendMessage";

export const createContactMessage = catchAsyncError(async (req, res) => {
  const { body } = req;

  const email = body.email;

  const template = `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #333333;">New Contact Us Message</h2>
  
  <div class="details" style="margin-bottom: 10px;">
      <strong>Name:</strong> ${body.fullName}<br>
      <strong>Email:</strong> ${body.email}<br>
      <strong>Subject:</strong> ${body.subject}<br>
  </div>
  
  <div class="message" style="margin-top: 20px;">
      <strong>Message:</strong><br>
      ${body.message}
  </div>
  
  <div class="footer" style="margin-top: 20px; color: #666666;">
      Please respond promptly to address the query or concern.
  </div>
</div>`;

  const adminEmail = process.env.MAIL as string;

  sendMessage(adminEmail, adminEmail, `Reach mail from ${email}`, template);
  res.json({
    message: "Successfully contact send",
    success: true,
    data: null,
  });
});
