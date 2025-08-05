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

    // Verificar tamanho (máximo 50MB - será redimensionado automaticamente)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem deve ter no máximo 50MB' }, { status: 400 });
    }

    // Criar diretório se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('Diretório de upload criado/verificado:', uploadDir);
    } catch (error) {
      console.error('Erro ao criar diretório:', error);
      return NextResponse.json({ error: 'Erro ao criar diretório de upload' }, { status: 500 });
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop().toLowerCase();
    const fileName = `${timestamp}_${randomString}.${extension}`;
    const filePath = path.join(uploadDir, fileName);

    console.log('Informações do arquivo:', {
      originalName: file.name,
      fileName: fileName,
      filePath: filePath,
      extension: extension
    });

    // Converter para buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Buffer criado, tamanho:', buffer.length);

    // Redimensionar e otimizar a imagem automaticamente
    try {
      console.log('Iniciando processamento com Sharp...');
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

      console.log('Imagem processada com sucesso:', {
        originalSize: buffer.length,
        optimizedSize: optimizedBuffer.length,
        reduction: `${((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(1)}%`
      });

      // Salvar imagem otimizada
      await writeFile(filePath, optimizedBuffer);
      console.log('Imagem salva no sistema de arquivos:', filePath);
      
    } catch (sharpError) {
      console.error('Erro ao processar imagem com Sharp:', sharpError);
      
      // Se falhar o processamento, tentar salvar original
      try {
        await writeFile(filePath, buffer);
        console.log('Imagem original salva como fallback:', filePath);
      } catch (writeError) {
        console.error('Erro ao salvar imagem original:', writeError);
        return NextResponse.json({ error: 'Erro ao salvar imagem' }, { status: 500 });
      }
    }

    // Retornar URL da imagem
    const imageUrl = `/uploads/${fileName}`;
    
    console.log('Upload concluído com sucesso:', {
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
    console.error('Erro geral no upload:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 });
  }
} 