"use client";
import { useEffect, useRef, useState } from 'react';
import * as Plot from "@observablehq/plot";

interface AnalyticsData {
  moods: number[];
  userInfo: {
    role: string;
    age: number;
    gender: string;
    ofA: string;
  };
  questionnaireId: string;
}

// Fonction utilitaire pour convertir en coordonnées polaires
function polarToCartesian(angle: number, radius: number) {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
}

export default function AnalyticsCharts({ roleFilter }: { roleFilter: string | string[] }) {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const histogramRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data.length || !histogramRef.current || !radarRef.current) return;

    // Filtrer les données pour le questionnaire 4 et exclure admin
    const questionnaire4Data = data.filter(item => 
      item.questionnaireId === "4" && 
      item.userInfo.role !== "admin" &&
      (Array.isArray(roleFilter) ? roleFilter.includes(item.userInfo.role) : item.userInfo.role === roleFilter)
    );

    // Définir les axes du radar (4 questions)
    const axes = ["Q1", "Q2", "Q3", "Q4"];
    const angleStep = (2 * Math.PI) / axes.length;

    // Préparer les données pour le radar chart
    const radarData = questionnaire4Data.flatMap(item => {
      const respondentId = item.userInfo.role + "_" + Math.random().toString(36).substr(2, 9);
      return item.moods.map((value, i) => {
        const angle = i * angleStep - Math.PI / 2; // Commencer à midi
        const { x, y } = polarToCartesian(angle, value / 10); // Normaliser sur [0,1]
        return {
          respondentId,
          question: axes[i],
          angle,
          radius: value / 10,
          x,
          y,
          value,
          role: item.userInfo.role
        };
      });
    });

    // Calculer les moyennes par rôle et par question
    const roleAverages = Object.entries(
      radarData.reduce((acc, d) => {
        if (!acc[d.role]) {
          acc[d.role] = {};
        }
        if (!acc[d.role][d.question]) {
          acc[d.role][d.question] = { sum: 0, count: 0 };
        }
        acc[d.role][d.question].sum += d.value;
        acc[d.role][d.question].count += 1;
        return acc;
      }, {} as Record<string, Record<string, { sum: number; count: number }>>)
    ).flatMap(([role, questions]) => {
      // Créer les points pour chaque axe
      const points = axes.map((question, i) => {
        const avg = questions[question].sum / questions[question].count;
        const angle = i * angleStep - Math.PI / 2;
        const { x, y } = polarToCartesian(angle, avg / 10);
        return { role, question, angle, radius: avg / 10, x, y, value: avg };
      });
      // Ajouter le premier point à la fin pour fermer le polygone
      return [...points, { ...points[0], question: "Q1_end" }];
    });

    // Créer le radar chart
    const radarChart = Plot.plot({
      width: 500,
      height: 500,
      padding: 50,
      inset: 10,
      style: {
        backgroundColor: "white",
      },
      marks: [
        // Grille radiale
        Plot.ruleY([0.2, 0.4, 0.6, 0.8, 1], {
          stroke: "#ddd",
          strokeWidth: 1
        }),

        // Axes
        ...axes.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return Plot.line([
            [0, 0],
            [Math.cos(angle), Math.sin(angle)]
          ], {
            stroke: "#ddd",
            strokeWidth: 1
          });
        }),

        // Labels des axes
        ...axes.map((label, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const { x, y } = polarToCartesian(angle, 1.2);
          return Plot.text([label], {
            x: x,
            y: y,
            fontSize: 12,
            textAnchor: "middle",
            dy: 0.3
          });
        }),

        // Points individuels (semi-transparents)
        Plot.dot(radarData, {
          x: "x",
          y: "y",
          stroke: "role",
          fill: "role",
          fillOpacity: 0.1,
          strokeOpacity: 0.2,
          r: 3
        }),

        Plot.line(radarData, {
            x: "x",
            y: "y",
            stroke: "role",
            z: "role",
            strokeWidth: 0.3,
            curve: "catmull-rom"
          }),

        // Zones moyennes par rôle
        Plot.area(roleAverages, {
          x1: "x",
          y1: "y",
          x2: 0,
          y2: 90,
          stroke: "role",
          fill: "role",
          fillOpacity: 0.1,
          z: "role",
          strokeWidth: 2,
          curve: "linear-closed"
        }),

        // Points moyens par rôle
        Plot.dot(roleAverages, {
          x: "x",
          y: "y",
          stroke: "role",
          fill: "white",
          r: 4
        })
      ],
      x: {
        domain: [-1.2, 1.2],
        grid: false,
        ticks: 0
      },
      y: {
        domain: [-1.2, 1.2],
        grid: false,
        ticks: 0
      },
      color: {
        legend: true,
        label: "Rôle"
      }
    });

    // Créer l'histogramme (votre code existant)
    const histogramChart = Plot.plot({
      width: 800,
      height: 400,
      grid: true,
      style: {
        background: "white",
        fontSize: "14px",
        overflow: "visible"
      },
      x: { 
        label: "Score total",
        nice: true
      },
      y: { 
        label: "Nombre de réponses",
        grid: true 
      },
      color: {
        legend: true,
        label: "Rôle"
      },
      marks: [
        Plot.rectY(
          questionnaire4Data.map(item => ({
            totalScore: item.moods.reduce((acc, curr) => acc + curr, 0),
            role: item.userInfo.role,
            ofA: item.userInfo.ofA
          })),
          Plot.binX(
            { y: "count" },
            { 
              x: "totalScore",
              fill: "role",
              thresholds: 20,
              opacity: 0.7,
              tip: true
            }
          )
        )
      ]
    });

    // Nettoyer et ajouter les graphiques
    radarRef.current.innerHTML = '';
    histogramRef.current.innerHTML = '';
    radarRef.current.append(radarChart);
    histogramRef.current.append(histogramChart);

    return () => {
      radarChart.remove();
      histogramChart.remove();
    };
  }, [data, roleFilter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Analyse du Questionnaire 4</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Histogramme */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Distribution des scores totaux</h3>
          <div ref={histogramRef} className="bg-white p-4 rounded-lg shadow"></div>
        </div>

        {/* Radar Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Profils des réponses par question</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <div ref={radarRef}></div>
            <div className="mt-4 text-sm text-gray-600">
              <p>• Les points représentent les réponses individuelles</p>
              <p>• Les lignes pleines représentent les moyennes par rôle</p>
              <p>• L&apos;échelle va de 0 (centre) à 10 (extérieur)</p>
              <p>• Q1 à Q4 correspondent aux quatre questions du questionnaire</p>
            </div>
          </div>
        </div>

        {/* Statistiques descriptives */}
        <div className="lg:col-span-2 mt-8">
          <h3 className="text-xl font-semibold mb-4">Statistiques par rôle</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Rôle</th>
                  <th className="text-right p-2">Nombre de répondants</th>
                  <th className="text-right p-2">Score moyen</th>
                  <th className="text-right p-2">Score médian</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  data
                    .filter(item => item.questionnaireId === "4")
                    .reduce((acc, curr) => {
                      const role = curr.userInfo.role;
                      if (!acc[role]) {
                        acc[role] = {
                          count: 0,
                          scores: []
                        };
                      }
                      acc[role].count++;
                      acc[role].scores.push(curr.moods.reduce((sum, mood) => sum + mood, 0));
                      return acc;
                    }, {} as Record<string, { count: number; scores: number[] }>)
                ).map(([role, stats]) => (
                  <tr key={role} className="border-t">
                    <td className="p-2">{role}</td>
                    <td className="text-right p-2">{stats.count}</td>
                    <td className="text-right p-2">
                      {(stats.scores.reduce((a, b) => a + b, 0) / stats.count).toFixed(1)}
                    </td>
                    <td className="text-right p-2">
                      {stats.scores.sort((a, b) => a - b)[Math.floor(stats.scores.length / 2)].toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 