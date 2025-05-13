
import { UserResult } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, XCircle } from "lucide-react";

interface ResultsListProps {
  results: UserResult[];
}

export function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="bg-muted/40 rounded-lg py-8 text-center">
        <p className="text-muted-foreground">No results available yet.</p>
      </div>
    );
  }

  // Sort results by correct answers (descending)
  const sortedResults = [...results].sort(
    (a, b) => b.correct_answers - a.correct_answers
  );

  return (
    <div className="space-y-4">
      {sortedResults.map((result, index) => (
        <Card key={`${result.username}-${index}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">
                {result.username}
              </CardTitle>
              <div className="text-sm">
                <span className="font-medium">Score:</span>{" "}
                <span className={result.correct_answers === result.total_questions ? "text-green-500" : ""}>
                  {result.correct_answers}/{result.total_questions}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="answers">
                <AccordionTrigger className="text-sm">
                  View Answers
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-2">
                    {result.answers.map((answer, i) => (
                      <div 
                        key={answer.question_id}
                        className={`p-3 rounded-md ${
                          answer.selected_option === answer.correct_option
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-red-500/10 border border-red-500/20"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {answer.selected_option === answer.correct_option ? (
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium mb-1">{answer.question_text}</div>
                            <div className="text-sm space-y-1">
                              <div>
                                <span className="font-medium">Selected:</span>{" "}
                                {answer.options[answer.selected_option]}
                              </div>
                              {answer.selected_option !== answer.correct_option && (
                                <div className="text-green-600 dark:text-green-400">
                                  <span className="font-medium">Correct:</span>{" "}
                                  {answer.options[answer.correct_option]}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
