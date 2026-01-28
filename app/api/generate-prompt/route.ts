import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Function to clean markdown formatting
function cleanMarkdownFormatting(text: string): string {
  // Remove markdown headers (####, ###, ##, #)
  let cleaned = text.replace(/^#{1,6}\s+/gm, '');
  
  // Remove code block markers (```javascript, ```, etc.)
  cleaned = cleaned.replace(/```[\w]*\n?/g, '');
  
  // Remove bold/italic markers but keep the text
  cleaned = cleaned.replace(/\*\*\*/g, '');  // Remove bold+italic
  cleaned = cleaned.replace(/\*\*/g, '');    // Remove bold
  cleaned = cleaned.replace(/\*/g, '');      // Remove italic
  cleaned = cleaned.replace(/__/g, '');      // Remove alternative bold
  cleaned = cleaned.replace(/_/g, '');       // Remove alternative italic
  
  // Remove inline code markers
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Clean up extra blank lines (more than 2 consecutive newlines)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace from start and end
  cleaned = cleaned.trim();
  
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const {
      projectDescription,
      language,
      framework,
      complexity,
      codeStyle,
      features,
      constraints,
    } = await request.json();

    const systemPrompt = `You are an expert at crafting detailed, comprehensive prompts for AI code generation tools like Claude, GPT-4, and other LLMs. Your goal is to generate a highly detailed, structured prompt that will help an AI generate high-quality, production-ready code.

IMPORTANT: Output the prompt in plain text format without any markdown formatting. Do not use:
- Headers (####, ###, ##, #)
- Code blocks (\`\`\`)
- Bold (**text**)
- Italic (*text*)
- Inline code (\`code\`)

Use plain text with clear section labels followed by colons, like "PROJECT OVERVIEW:" or "TECHNICAL REQUIREMENTS:".

The prompt should include:
1. Clear project overview and objectives
2. Detailed technical requirements
3. Specific coding standards and best practices
4. Architecture and design patterns to follow
5. Error handling and edge cases to consider
6. Testing requirements
7. Performance and security considerations
8. Documentation requirements

Make the prompt extremely detailed and specific to ensure the AI generates the best possible code.`;

    const userPrompt = `Generate a comprehensive AI prompt for the following project:

PROJECT DESCRIPTION:
${projectDescription}

TECHNICAL SPECIFICATIONS:
- Programming Language: ${language}
- Framework/Library: ${framework}
- Complexity Level: ${complexity}
- Code Style: ${codeStyle}
${features ? `- Required Features: ${features}` : ''}
${constraints ? `- Constraints & Requirements: ${constraints}` : ''}

Create a detailed prompt that:
1. Clearly defines the project scope and objectives
2. Specifies all technical requirements and dependencies
3. Outlines the expected code structure and architecture
4. Includes specific coding standards for ${language}${framework !== 'none' ? ` and ${framework}` : ''}
5. Addresses error handling, edge cases, and validation
6. Specifies testing requirements (unit tests, integration tests)
7. Includes performance optimization guidelines
8. Covers security best practices
9. Defines clear success criteria
10. Requests proper documentation and comments

CRITICAL: Format the output as plain text without any markdown. Use section labels like "SECTION_NAME:" followed by the content. Make it ready to copy-paste directly into an AI code generation tool.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    let generatedPrompt = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Clean any markdown formatting that might have slipped through
    generatedPrompt = cleanMarkdownFormatting(generatedPrompt);

    return NextResponse.json({ prompt: generatedPrompt }, { status: 200 });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}