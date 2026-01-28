import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Handle idea generation request
interface IdeaRequest {
  interests?: string;
  skillLevel?: string;
  projectType?: string;
  timeCommitment?: string;
  previousTitles?: string[];
  seed?: number;
}

// Handle prompt generation request
interface PromptRequest {
  projectDescription: string;
  language: string;
  framework: string;
  complexity: string;
  codeStyle: string;
  features?: string;
  constraints?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is an idea generation request
    if (body.skillLevel && body.projectType) {
      return handleIdeaGeneration(body);
    }
    
    // Otherwise it's a prompt generation request
    return handlePromptGeneration(body);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function handleIdeaGeneration(body: IdeaRequest) {
  const { interests, skillLevel, projectType, timeCommitment, previousTitles = [], seed } = body;

  // Create exclusion text if there are previous titles
  const exclusionText = previousTitles.length > 0 
    ? `\n\nCRITICAL INSTRUCTION - AVOID DUPLICATES:
You have previously generated these project ideas:
${previousTitles.map((title: string, i: number) => `${i + 1}. ${title}`).join('\n')}

You MUST generate completely NEW and DIFFERENT project ideas. DO NOT:
- Use any of the titles above
- Create variations of the titles above
- Use similar concepts or themes as the titles above

Generate entirely fresh, unique, and creative ideas that are distinctly different from all previous suggestions.`
    : '';

  const prompt = `You are an expert software development mentor helping someone find the perfect project to build.

Generation ID: ${seed || Date.now()}

Generate 3 unique, creative, and practical project ideas based on these criteria:
- Interests: ${interests || 'general software development'}
- Skill Level: ${skillLevel}
- Project Type: ${projectType}
- Time Commitment: ${timeCommitment}
${exclusionText}

For each project idea, provide:
1. A catchy, descriptive title (must be unique and creative)
2. A 2-3 sentence description explaining what the project does and why it's valuable
3. A tech stack (4-6 specific technologies/frameworks)
4. Learning outcomes (3-4 key skills they'll gain)
5. Difficulty level (Beginner/Intermediate/Advanced/Expert)
6. Estimated completion time

Make the ideas:
- Practical and buildable
- Aligned with current industry trends
- Progressively challenging (first easier, third more complex)
- Specific enough to start immediately
- Relevant to the user's interests
- COMPLETELY UNIQUE from any previously generated ideas

Use maximum creativity to ensure variety. Think outside the box. Consider:
- Different domains (finance, health, education, entertainment, productivity, etc.)
- Different scales (micro-services, full applications, tools, games, etc.)
- Different technologies (web, mobile, desktop, CLI, APIs, etc.)
- Unique combinations of features and use cases

CRITICAL: Return ONLY the raw JSON object with no markdown formatting, no code blocks, no backticks, and no additional text.

Format:
{
  "ideas": [
    {
      "title": "Project Title",
      "description": "Detailed description.",
      "techStack": ["Tech1", "Tech2", "Tech3", "Tech4"],
      "learningOutcomes": ["Skill 1", "Skill 2", "Skill 3"],
      "difficulty": "Intermediate",
      "estimatedTime": "One Week"
    }
  ]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 1.0, // Maximum creativity for more varied responses
      messages: [{ role: 'user', content: prompt }],
    });

    let responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');

    // Clean up the response - remove markdown code blocks if present
    responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Find the JSON object (between first { and last })
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      responseText = responseText.substring(firstBrace, lastBrace + 1);
    }

    const ideas = JSON.parse(responseText);
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate project ideas' },
      { status: 500 }
    );
  }
}

async function handlePromptGeneration(body: PromptRequest) {
  const {
    projectDescription,
    language,
    framework,
    complexity,
    codeStyle,
    features,
    constraints,
  } = body;

  const systemPrompt = `You are an expert prompt engineer specializing in creating ultra-detailed, comprehensive prompts for AI code generation tools like Claude, GPT-4, Gemini, and Grok.

Your task is to transform user requirements into production-ready, detailed prompts that will guide AI models to generate high-quality, complete code.

IMPORTANT: Return ONLY plain text. Do NOT use:
- Markdown headings (##, ###)
- Bold or italic formatting (**, *, _)
- Emojis
- Code blocks or backticks
- Bullet points with special characters

Use simple formatting:
- Section titles in CAPS followed by colon
- Numbered lists with plain numbers (1., 2., 3.)
- Dashes for sub-items (-)
- Blank lines to separate sections

Generate a comprehensive, structured prompt that includes:
1. Clear project overview and objectives
2. Detailed technical specifications
3. Code structure and architecture guidelines
4. Specific implementation requirements
5. Best practices and patterns to follow
6. Error handling and edge cases
7. Testing considerations
8. Documentation requirements

Make the prompt detailed enough that an AI model can generate production-ready code without additional clarification.`;

  const userPrompt = `Create an ultra-detailed AI code generation prompt for:

PROJECT DESCRIPTION:
${projectDescription}

TECHNICAL SPECIFICATIONS:
- Language: ${language}
- Framework: ${framework !== 'none' ? framework : 'Vanilla/No framework'}
- Complexity Level: ${complexity}
- Code Style: ${codeStyle}
${features ? `- Required Features: ${features}` : ''}
${constraints ? `- Constraints: ${constraints}` : ''}

Generate a comprehensive prompt that will guide an AI to create complete, production-ready code. Include specific technical details, code structure guidance, and best practices. Use plain text formatting only.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    let prompt = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');

    // Clean up any markdown that might have slipped through
    prompt = prompt
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/_(.+?)_/g, '$1') // Remove italic underscore
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      // Remove common emojis
      .replace(/[🎯🔧⚡📋🛠️💡✨🚀📝📄💻🖥️📱🌐🎨📊🗄️]/g, '')
      .trim();

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate code prompt' },
      { status: 500 }
    );
  }
}