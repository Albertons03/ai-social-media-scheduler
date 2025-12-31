/**
 * Contact Form API Endpoint
 * Handles customer support messages and forwards them via Resend
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Send email to support team
    await resend.emails.send({
      from: "LandingBits Contact <onboarding@resend.dev>",
      to: ["albertons@landingbits.com"], // Zoho email for support
      subject: `Support Request: ${subject || "No Subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Support Request</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; font-size: 12px; color: #666;">
            <p>Sent from: landingbits.net contact form</p>
            <p>Time: ${new Date().toISOString()}</p>
          </div>
        </div>
      `,
    });

    // Send auto-reply to customer
    await resend.emails.send({
      from: "LandingBits Support <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06B6D4;">Thanks for reaching out!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="font-style: italic;">"${message.substring(0, 200)}${
        message.length > 200 ? "..." : ""
      }"</p>
          </div>
          
          <p>Best regards,<br>
          The LandingBits Support Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666;">
            This is an automated response. Please don't reply to this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
