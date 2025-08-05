import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // Verificar tamanho (máximo 50MB)
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
      
      // Tentar usar uma pasta alternativa
      const alternativeDir = path.join(process.cwd(), 'public');
      console.log('Tentando usar pasta alternativa:', alternativeDir);
      
      try {
        // Salvar na pasta public diretamente
        const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`;
        const filePath = path.join(alternativeDir, fileName);
        
        await writeFile(filePath, buffer);
        console.log('Imagem salva na pasta alternativa:', filePath);
        
        const imageUrl = `/${fileName}`;
        return NextResponse.json({ 
          success: true, 
          imageUrl: imageUrl,
          message: 'Imagem enviada com sucesso (pasta alternativa)' 
        });
      } catch (altError) {
        console.error('Erro na pasta alternativa:', altError);
        return NextResponse.json({ error: 'Erro ao criar diretório de upload' }, { status: 500 });
      }
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

    // Salvar imagem original (sem processamento por enquanto)
    try {
      await writeFile(filePath, buffer);
      console.log('Imagem salva no sistema de arquivos:', filePath);
    } catch (writeError) {
      console.error('Erro ao salvar imagem:', writeError);
      return NextResponse.json({ error: 'Erro ao salvar imagem' }, { status: 500 });
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