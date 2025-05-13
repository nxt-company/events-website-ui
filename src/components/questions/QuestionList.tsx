
import { Question } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface QuestionListProps {
  questions: Question[];
  onDelete?: (questionId: string) => void;
  isCreator: boolean;
}

export function QuestionList({ questions, onDelete, isCreator }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="bg-muted/40 rounded-lg py-8 text-center">
        <p className="text-muted-foreground">No questions have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base font-medium">{question.text}</CardTitle>
              {isCreator && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(question.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {question.options.map((option, index) => (
                <li 
                  key={index} 
                  className={`px-3 py-2 rounded-md ${
                    isCreator && index === question.correct_answer
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background border">
                      {index + 1}
                    </span>
                    <span>
                      {option}
                      {isCreator && index === question.correct_answer && (
                        <span className="ml-2 text-xs font-medium text-primary">(Correct)</span>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
