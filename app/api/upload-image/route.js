import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

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

    // Criar diretório se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // Converter para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Redimensionar e otimizar a imagem automaticamente
    try {
      const optimizedBuffer = await sharp(buffer)
        .resize(800, 600, {
          fit: 'cover', // Mantém proporção e corta se necessário
          position: 'center' // Centraliza o corte
        })
        .jpeg({ 
          quality: 80, // Qualidade otimizada
          progressive: true // Carregamento progressivo
        })
        .toBuffer();

      // Salvar imagem otimizada
      await writeFile(filePath, optimizedBuffer);
      
      console.log('Imagem redimensionada e otimizada:', {
        originalSize: buffer.length,
        optimizedSize: optimizedBuffer.length,
        reduction: `${((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(1)}%`
      });
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      // Se falhar o processamento, salvar original
      await writeFile(filePath, buffer);
    }

    // Retornar URL da imagem
    const imageUrl = `/uploads/${fileName}`;
    
    console.log('Imagem salva com sucesso:', {
      fileName: fileName,
      imageUrl: imageUrl,
      filePath: filePath
    });
    
    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Imagem enviada com sucesso' 
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 