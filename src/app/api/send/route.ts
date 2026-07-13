import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, subject, text, html } = await request.json();

    const data = await resend.emails.send({
      from: 'TargetPrep <onboarding@resend.dev>', // Update with your verified domain from Resend dashboard later
      to: [email],
      subject: subject || 'Hello from TargetPrep!',
      text: text || 'Welcome to our platform!',
      html: html || `<p>${text || 'Welcome to our platform!'}</p>`,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
