import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

/**
 * Task Execution API
 * This endpoint handles actual task execution for agents
 * Agents can call this to perform actions like creating pages, updating content, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      taskType, 
      parameters, 
      projectId,
      conversationId 
    } = body;

    if (!taskType || !parameters) {
      return NextResponse.json(
        { error: "taskType and parameters are required" },
        { status: 400 }
      );
    }

    // Get project information
    let projectData: any = null;
    if (projectId) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      
      if (!error && data) {
        projectData = data;
      }
    }

    if (!projectData) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const cms = projectData.cms?.toLowerCase();
    const cmsUrl = projectData.cms_url || projectData.domain;

    // Execute task based on type
    let result: any = {};

    switch (taskType) {
      case "create_page":
        result = await executeCreatePage(cms, cmsUrl, parameters);
        break;
      
      case "create_post":
        result = await executeCreatePost(cms, cmsUrl, parameters);
        break;
      
      case "update_content":
        result = await executeUpdateContent(cms, cmsUrl, parameters);
        break;
      
      case "create_task":
        // Create a structured task in the database
        result = await createStructuredTask(projectId, conversationId, parameters);
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown task type: ${taskType}` },
          { status: 400 }
        );
    }

    // Log the execution
    if (conversationId) {
      await supabase.from("assistant_messages").insert({
        conversation_id: conversationId,
        author: "agent",
        agent_id: "webEngineer",
        kind: "status",
        text: `Executed task: ${taskType} - ${JSON.stringify(result)}`,
      });
    }

    return NextResponse.json({
      success: true,
      taskType,
      result,
      message: `Task ${taskType} executed successfully`,
    });
  } catch (err: any) {
    console.error("Task execution error:", err);
    return NextResponse.json(
      {
        error: "Failed to execute task",
        details: err.message || String(err),
      },
      { status: 500 }
    );
  }
}

// Task execution functions
async function executeCreatePage(cms: string, cmsUrl: string, params: any) {
  // TODO: Implement actual CMS API calls
  // For now, return a structured response indicating what would be done
  
  return {
    action: "create_page",
    cms,
    cmsUrl,
    pageTitle: params.title,
    pageContent: params.content,
    status: "pending_execution",
    message: `Page "${params.title}" will be created on ${cms} at ${cmsUrl}`,
    note: "CMS integration API calls need to be implemented based on platform"
  };
}

async function executeCreatePost(cms: string, cmsUrl: string, params: any) {
  return {
    action: "create_post",
    cms,
    cmsUrl,
    postTitle: params.title,
    postContent: params.content,
    status: "pending_execution",
    message: `Post "${params.title}" will be created on ${cms}`,
    note: "CMS integration API calls need to be implemented"
  };
}

async function executeUpdateContent(cms: string, cmsUrl: string, params: any) {
  return {
    action: "update_content",
    cms,
    cmsUrl,
    target: params.target,
    content: params.content,
    status: "pending_execution",
    message: `Content will be updated on ${cms}`,
    note: "CMS integration API calls need to be implemented"
  };
}

async function createStructuredTask(projectId: string, conversationId: string | null, params: any) {
  const { data, error } = await supabase
    .from("assistant_tasks")
    .insert({
      conversation_id: conversationId,
      action: params.action || "execute",
      target: params.target || "unknown",
      intent: params.intent || params.description || "Task execution",
      priority: params.priority || "medium",
      notes: params.notes || JSON.stringify(params),
      status: "in_progress",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return {
    taskId: data.id,
    status: "created",
    message: "Task created and queued for execution",
  };
}

