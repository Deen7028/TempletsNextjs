import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

async function handleProxy(request: NextRequest, params: { path: string[] }) {
  const pathStr = params.path?.join("/") || "";
  const search = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL.replace(/\/$/, "")}/${pathStr}${search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  try {
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      credentials: "include",
    });

    const resData = await response.text();
    return new NextResponse(resData, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Gateway Proxy Error", message: err.message },
      { status: 502 }
    );
  }
}
