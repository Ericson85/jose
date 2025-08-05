import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('API de upload chamada');
    const formData = await request.formData();
    const file = formData.get('image');
    
    console.log('Arquivo recebido:', file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : 'Nenhum arquivo');
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 });
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Arquivo deve ser uma imagem' }, { status: 400 });
    }

    // Verificar tamanho (máximo 5MB para base64)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem deve ter no máximo 5MB' }, { status: 400 });
    }

    // Converter para base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const imageUrl = `data:${mimeType};base64,${base64}`;

    console.log('Imagem convertida para base64:', {
      originalSize: buffer.length,
      base64Length: base64.length,
      mimeType: mimeType
    });
    
    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Imagem enviada com sucesso (base64)' 
    });

  } catch (error) {
    console.error('Erro geral no upload:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
} 