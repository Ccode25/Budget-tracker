"use client";

const stats = [
  { label: "Active Transactions Tracked", value: "10,000+" },
  { label: "Uptime & Availability", value: "99.9%" },
  { label: "Statement Parsing Accuracy", value: "100%" },
  { label: "Monthly Savings Growth", value: "+34%" },
];

export function StatsSection() {
  return (
    <section id="stats" className="py-16 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-8 sm:p-12 backdrop-blur-xl shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
